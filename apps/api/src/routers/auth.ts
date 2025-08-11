import crypto from "node:crypto";
import { EmailSchema } from "@repo/shared";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { signAccessToken } from "../jwt.js";
import { publicProcedure, router } from "../trpc.js";

const VerifyInput = z.object({
	email: EmailSchema,
	code: z.string().min(6).max(12),
});

export const authRouter = router({
	requestCode: publicProcedure.input(z.object({ email: EmailSchema })).mutation(async ({ ctx, input }) => {
		const code = crypto.randomBytes(8).toString("hex").slice(0, 6);

		const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

		await ctx.prisma.verificationToken.upsert({
			where: { email: input.email },
			update: {
				code,
				expiresAt,
				consumedAt: null,
			},
			create: {
				email: input.email,
				code,
				expiresAt,
			},
		});

		ctx.reply.log.info({ email: input.email, code }, "Verification code issued");

		return { message: "Verification code sent" };
	}),

	verify: publicProcedure.input(VerifyInput).mutation(async ({ ctx, input }) => {
		const vt = await ctx.prisma.verificationToken.findUnique({
			where: { email: input.email },
		});

		const valid = !!vt && !vt.consumedAt && vt.code === input.code && vt.expiresAt.getTime() > Date.now();

		if (!valid) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Invalid or expired code",
			});
		}

		await ctx.prisma.verificationToken.update({
			where: { email: input.email },
			data: { consumedAt: new Date() },
		});

		const user = await ctx.prisma.user.upsert({
			where: { email: input.email },
			update: {},
			create: { email: input.email },
		});

		const accessToken = await signAccessToken(user.id);

		return {
			access_token: accessToken,
			user: { id: user.id, email: user.email },
		};
	}),
});
