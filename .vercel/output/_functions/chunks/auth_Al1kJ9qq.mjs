import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "node:crypto";
//#region src/lib/auth.ts
var JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-in-production");
var TOKEN_EXPIRY = "7d";
async function createToken(username) {
	return new SignJWT({ username }).setProtectedHeader({ alg: "HS256" }).setExpirationTime(TOKEN_EXPIRY).sign(JWT_SECRET);
}
async function verifyToken(token) {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return { username: payload.username };
	} catch {
		return null;
	}
}
function validateCredentials(username, password) {
	const validUser = Buffer.from(process.env.BLOG_USER ?? "admin");
	const validPass = Buffer.from(process.env.BLOG_PASSWORD ?? "admin");
	const inputUser = Buffer.from(username);
	const inputPass = Buffer.from(password);
	if (validUser.length !== inputUser.length || validPass.length !== inputPass.length) return false;
	return timingSafeEqual(validUser, inputUser) && timingSafeEqual(validPass, inputPass);
}
//#endregion
export { validateCredentials as n, verifyToken as r, createToken as t };
