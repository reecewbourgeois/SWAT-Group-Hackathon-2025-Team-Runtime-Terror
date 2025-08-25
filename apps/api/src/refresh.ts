import crypto from "node:crypto";
import { prisma } from "@repo/db";
import type { FastifyReply, FastifyRequest } from "fastify";

const COOKIE_NAME = "refresh_token";
const THIRTY_DAYS_S = 30 * 24 * 60 * 60;

function hashToken(token: string) {
	return crypto.createHash("sha256").update(token).digest("hex");
}

function newTokenString() {
	return crypto.randomBytes(32).toString("hex");
}

export async function createRefreshSession(userId: string, reply: FastifyReply) {
	const raw = newTokenString();
	const tokenHash = hashToken(raw);
	const expiresAt = new Date(Date.now() + THIRTY_DAYS_S * 1000);

	await prisma.refreshSession.create({
		data: { userId, tokenHash, expiresAt },
	});

	reply.setCookie(COOKIE_NAME, raw, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: THIRTY_DAYS_S,
	});
}

export async function rotateRefreshSession(req: FastifyRequest, reply: FastifyReply) {
	const raw = req.cookies[COOKIE_NAME];

	if (!raw) return null;

	const tokenHash = hashToken(raw);
	const existing = await prisma.refreshSession.findUnique({
		where: { tokenHash },
		include: { user: true },
	});

	if (!existing || existing.revokedAt || existing.expiresAt.getTime() <= Date.now()) {
		// ensure cookie cleared if invalid/expired
		reply.clearCookie(COOKIE_NAME, { path: "/" });
		return null;
	}

	// rotate: revoke old and issue new
	await prisma.refreshSession.update({
		where: { tokenHash },
		data: { revokedAt: new Date() },
	});

	const newRaw = newTokenString();
	const newHash = hashToken(newRaw);
	const expiresAt = new Date(Date.now() + THIRTY_DAYS_S * 1000);

	await prisma.refreshSession.create({
		data: { userId: existing.userId, tokenHash: newHash, expiresAt },
	});

	reply.setCookie(COOKIE_NAME, newRaw, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: THIRTY_DAYS_S,
	});

	return existing.user; // return user for issuing a new access token
}

export function clearRefreshCookie(reply: FastifyReply) {
	reply.clearCookie(COOKIE_NAME, { path: "/" });
}

export async function revokeCurrentRefreshSession(req: FastifyRequest, reply: FastifyReply) {
	const raw = req.cookies[COOKIE_NAME];

	if (!raw) {
		reply.clearCookie(COOKIE_NAME, { path: "/" });
		return;
	}

	const tokenHash = hashToken(raw);

	await prisma.refreshSession
		.update({
			where: { tokenHash },
			data: { revokedAt: new Date() },
		})
		.catch(() => {
			/* ignore if already missing */
		});

	reply.clearCookie(COOKIE_NAME, { path: "/" });
}
