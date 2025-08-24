import { appRouter } from "./routers/app.js";
import { authRouter } from "./routers/auth.js";
import { router } from "./trpc.js";

export const rootRouter = router({
	auth: authRouter,
	api: appRouter,
});

export type RootRouter = typeof rootRouter;
