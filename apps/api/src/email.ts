import type { FastifyReply } from "fastify";
import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;

const resend = API_KEY === undefined ? null : new Resend(API_KEY);

export async function sendVerificationEmail(ctx: { res: FastifyReply }, opts: { to: string; code: string }) {
	if (resend === null) {
		ctx.res.log.info({ email: opts.to, code: opts.code }, "Verification code issued");
		return Promise.resolve();
	}

	const from = process.env.MAIL_FROM || "Your App <noreply@yourdomain.com>";
	const subject = "Your verification code";
	const text = `Your verification code is ${opts.code}. It expires in 10 minutes.`;
	const html = `<p>Your verification code is <strong>${opts.code}</strong>.</p><p>It expires in 10 minutes.</p>`;
	await resend.emails.send({
		from,
		to: opts.to,
		subject,
		text,
		html,
	});
}
