import { ISSUER } from "@repo/shared";
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_only_change_me");

export async function signAccessToken(userId: string): Promise<string> {
	return await new SignJWT({ uid: userId })
		.setProtectedHeader({ alg: "HS256", typ: "JWT" })
		.setIssuedAt()
		.setIssuer(ISSUER)
		.setExpirationTime("15m")
		.sign(secret);
}

export async function verifyAccessToken(token: string): Promise<string> {
	const { payload } = await jwtVerify(token, secret, { issuer: ISSUER });
	const uid = typeof payload.uid === "string" ? payload.uid : "";
	if (!uid) throw new Error("Invalid payload");
	return uid;
}
