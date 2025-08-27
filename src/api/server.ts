import "dotenv/config";
import path from "node:path";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { type FastifyTRPCPluginOptions, fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import { REFRESH_HEADER } from "../shared/index.js";
import { signAccessToken } from "./jwt.js";
import { rotateRefreshSession } from "./refresh.js";
import { rootRouter } from "./routers/index.js";
import { fastifyContext } from "./trpc.js";

const PORT = Number(process.env.PORT || 5000);

async function main() {
	const app = Fastify({ logger: true });

	await app.register(cors, {
		origin: true,
		credentials: true,
		exposedHeaders: [REFRESH_HEADER],
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

	// Static files (React build)
	const WEB_DIST_DIR = path.resolve(process.cwd(), "dist", "web");
	await app.register(fastifyStatic, {
		root: WEB_DIST_DIR,
		prefix: "/",
	});

	// SPA fallback: send index.html for unknown GET routes (after /trpc and /auth)
	app.setNotFoundHandler((req, reply) => {
		if (req.method === "GET" && !req.url.startsWith("/trpc") && !req.url.startsWith("/auth")) {
			return reply.sendFile("index.html");
		}
		reply.code(404).send({ error: "Not Found" });
	});

	await app.listen({ port: PORT, host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost" });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
