import "dotenv/config";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { REFRESH_HEADER } from "@repo/shared";
import { type FastifyTRPCPluginOptions, fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import { signAccessToken } from "./jwt.js";
import { rotateRefreshSession } from "./refresh.js";
import { rootRouter } from "./root.js";
import { fastifyContext } from "./trpc.js";

const PORT = Number(process.env.PORT || 5000);

async function main() {
	const app = Fastify({ logger: true });

	await app.register(cors, {
		origin: true,
		credentials: true,
		exposedHeaders: [REFRESH_HEADER],
	});

	await app.register(rateLimit, {
		max: 20,
		timeWindow: "1 minute",
	});

	await app.register(fastifyCookie, {});

	await app.register(fastifyTRPCPlugin, {
		prefix: "/trpc",
		trpcOptions: {
			router: rootRouter,
			createContext: fastifyContext,
			onError({ path, error }) {
				// report to error monitoring
				console.error(`Error in tRPC handler on path '${path}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<typeof rootRouter>["trpcOptions"],
	});

	app.get("/auth/refresh", async (req, reply) => {
		const user = await rotateRefreshSession(req, reply);
		if (!user) {
			return reply.code(401).send({ error: "No valid refresh session" });
		}
		const access = await signAccessToken(user.id);
		// Return in body and header for convenience
		reply.header(REFRESH_HEADER, access);
		return { access_token: access, user: { id: user.id, email: user.email } };
	});

	await app.listen({ port: PORT, host: "localhost" });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
