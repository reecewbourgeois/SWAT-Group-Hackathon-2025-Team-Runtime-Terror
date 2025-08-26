import { authedProcedure, router } from "../trpc.js";

export const appRouter = router({
	hello: authedProcedure.query(({ ctx }) => {
		return {
			message: `Hello, ${ctx.user.email}! This is a protected endpoint.`,
		};
	}),
});

export type AppRouter = typeof appRouter;
