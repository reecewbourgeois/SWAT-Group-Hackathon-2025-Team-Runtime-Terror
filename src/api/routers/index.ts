import { router } from "../trpc.js";
import { appRouter } from "./app.js";
import { authRouter } from "./auth.js";

export const rootRouter = router({
    auth: authRouter,
    api: appRouter,
});