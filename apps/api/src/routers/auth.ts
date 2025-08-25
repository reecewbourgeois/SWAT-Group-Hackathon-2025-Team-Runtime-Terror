import crypto from "node:crypto";
import nodeCrypto from "node:crypto";
import { AccessCodeSchema, EmailSchema } from "@repo/shared";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendVerificationEmail } from "../email.js";
import { signAccessToken } from "../jwt.js";
import { createRefreshSession, revokeCurrentRefreshSession } from "../refresh.js";
import { publicProcedure, router } from "../trpc.js";

function timingSafeEqualStr(a: string, b: string): boolean {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) return false;
	return nodeCrypto.timingSafeEqual(aBuf, bBuf);
}

// Parse once per process
const ALLOWED_DOMAINS_RAW = (process.env.REGISTRATION_ALLOWED_EMAIL_DOMAINS || "")
	.split(",")
	.map((s) => s.trim().toLowerCase())
	.filter(Boolean);

const ALLOWED_EXACT = new Set(ALLOWED_DOMAINS_RAW.filter((d) => !d.startsWith("*.")));
const ALLOWED_SUFFIXES = ALLOWED_DOMAINS_RAW.filter((d) => d.startsWith("*.")).map((d) => d.slice(2)); // strip "*."

function extractDomain(email: string): string | null {
	const at = email.lastIndexOf("@");
	if (at === -1) return null;
	return email.slice(at + 1).toLowerCase();
}

function isEmailAllowed(email: string): boolean {
	// If no allowlist configured, allow all
	if (ALLOWED_EXACT.size === 0 && ALLOWED_SUFFIXES.length === 0) return true;
	const domain = extractDomain(email);
	if (!domain) return false;
	if (ALLOWED_EXACT.has(domain)) return true;
	// Wildcard matches subdomains: "*.example.com" matches "a.example.com"
	// If you want the bare "example.com" too, include it explicitly in env.
	return ALLOWED_SUFFIXES.some((suf) => domain.endsWith("." + suf));
}

function assertRegistrationAllowed(email: string, accessCode: string) {
	const required = process.env.REGISTRATION_ACCESS_CODE;
	if (!required) {
		// Misconfiguration: fail closed
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Registration is not configured",
		});
	}
	const accessOk = timingSafeEqualStr(required, accessCode);
	const emailOk = isEmailAllowed(email);
	if (!accessOk || !emailOk) {
		// Generic message on purpose to not leak which check failed
		throw new TRPCError({ code: "FORBIDDEN", message: "Not allowed" });
	}
}

const VerifyInput = z.object({
	email: EmailSchema,
	code: z.string().min(6).max(12),
	accessCode: AccessCodeSchema,
});

export const authRouter = router({
	requestCode: publicProcedure
		.input(z.object({ email: EmailSchema, accessCode: AccessCodeSchema }))
		.mutation(async ({ ctx, input }) => {
			// Gate BEFORE any DB writes
			assertRegistrationAllowed(input.email, input.accessCode);

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

			await sendVerificationEmail(ctx, { to: input.email, code });

			return { message: "Verification code sent" };
		}),

	verify: publicProcedure.input(VerifyInput).mutation(async ({ ctx, input }) => {
		// Gate BEFORE any DB writes
		assertRegistrationAllowed(input.email, input.accessCode);

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

		await createRefreshSession(user.id, ctx.res);
		const accessToken = await signAccessToken(user.id);

		return { access_token: accessToken, user: { id: user.id, email: user.email } };
	}),

	logout: publicProcedure.mutation(async ({ ctx }) => {
		// Revoke current refresh session (cookie) and clear cookie
		await revokeCurrentRefreshSession(ctx.req, ctx.res);

		return { success: true };
	}),
});
