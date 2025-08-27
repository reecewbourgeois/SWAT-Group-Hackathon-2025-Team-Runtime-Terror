import { TRPCError } from "@trpc/server";
import type { FastifyReply } from "fastify";

type Bucket = { n: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function hit(key: string, limit: number, windowMs: number, reply?: FastifyReply) {
	const now = Date.now();
	const b = buckets.get(key);
	if (!b || now >= b.resetAt) {
		buckets.set(key, { n: 1, resetAt: now + windowMs });
		return;
	}
	if (b.n >= limit) {
		const retrySec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
		if (reply) reply.header("Retry-After", String(retrySec));
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: `Try again in ${retrySec}s`,
		});
	}
	b.n++;
}

/**
 * Policy:
 * - 3 per IP / 10 min
 * - 3 per email / 10 min 
 */
export function rateLimitRequestCode(ip: string, email: string, reply: FastifyReply) {
	hit(`rc:ip:${ip}`, 3, 10 * 60 * 1000, reply);
	hit(`rc:email:${email}`, 3, 10 * 60 * 1000, reply);
}

/**
 * Policy:
 * - 5 per IP / 10 min
 * - 5 per email / 10 min 
 */
export function rateLimitVerify(ip: string, email: string, reply: FastifyReply) {
	hit(`vf:ip:${ip}`, 5, 10 * 60 * 1000, reply);
	hit(`vf:email:${email}`, 5, 10 * 60 * 1000, reply);
}
