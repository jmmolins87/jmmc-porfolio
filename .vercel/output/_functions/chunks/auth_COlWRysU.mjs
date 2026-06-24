import { SignJWT, jwtVerify } from "jose";
//#region src/lib/auth.ts
function getSecret() {
	return new TextEncoder().encode("+IPhG4FXzScSYaTzLhlo0/2Y8WMDmrAOaPaX/9banDU=");
}
function getEnv(key, fallback) {
	return Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_SITE_URL": "https://jmmc.vercel.app",
		"SITE": "https://jmmc.vercel.app",
		"SSR": true
	}, {
		BLOG_PASSWORD: "07870787!jm",
		BLOG_USER: "juanma",
		JWT_SECRET: "+IPhG4FXzScSYaTzLhlo0/2Y8WMDmrAOaPaX/9banDU=",
		USER: "juanmamolinncortes"
	})[key] ?? process.env[key] ?? fallback;
}
var TOKEN_EXPIRY = "7d";
async function createToken(username) {
	return new SignJWT({ username }).setProtectedHeader({ alg: "HS256" }).setExpirationTime(TOKEN_EXPIRY).sign(getSecret());
}
async function verifyToken(token) {
	try {
		const { payload } = await jwtVerify(token, getSecret());
		return { username: payload.username };
	} catch {
		return null;
	}
}
function validateCredentials(username, password) {
	const validUser = getEnv("BLOG_USER", "admin");
	const validPass = getEnv("BLOG_PASSWORD", "admin");
	return username === validUser && password === validPass;
}
//#endregion
export { validateCredentials as n, verifyToken as r, createToken as t };
