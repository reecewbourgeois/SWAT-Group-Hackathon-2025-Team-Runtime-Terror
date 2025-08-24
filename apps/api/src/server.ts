import "dotenv/config";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { REFRESH_HEADER } from "@repo/shared";
import { type FastifyTRPCPluginOptions, fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import { appRouter } from "./routers/app.js";
import { authRouter } from "./routers/auth.js";
import { fastifyContext, router } from "./trpc.js";

const PORT = Number(process.env.PORT || 5000);

async function main() {
	const app = Fastify({ logger: true });

	await app.register(cors, {
		origin: true,
		credentials: false,
		exposedHeaders: [REFRESH_HEADER],
	});

	await app.register(rateLimit, {
		max: 20,
		timeWindow: "1 minute",
	});

	const rootRouter = router({
		auth: authRouter,
		api: appRouter,
	});

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

	await app.listen({ port: PORT });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
