import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { REFRESH_HEADER } from "../shared/index.js";
import { signAccessToken, verifyAccessToken } from "./jwt.js";
import { prisma } from "./prisma/index.js";

export function fastifyContext({ req, res }: CreateFastifyContextOptions) {
	return {
		req,
		res,
		prisma,
		user: null as null | { id: string; email: string },
	};
}
export type Context = Awaited<ReturnType<typeof fastifyContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(
	t.middleware(async ({ ctx, next }) => {
		const auth = ctx.req.headers.authorization;
		if (!auth?.startsWith("Bearer ")) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		const token = auth.slice("Bearer ".length).trim();
		let uid: string;
		try {
			uid = await verifyAccessToken(token);
		} catch (_e) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Invalid token",
			});
		}

		const user = await ctx.prisma.user.findUnique({
			where: { id: uid },
		});
		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		// Refresh token on every authed call
		const newToken = await signAccessToken(user.id);
		ctx.res.header(REFRESH_HEADER, newToken);

		return next({
			ctx: {
				...ctx,
				user: { id: user.id, email: user.email },
			},
		});
	}),
);
