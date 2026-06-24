import { H as defineMiddleware, z as sequence } from "./chunks/fetch-state_DCNjDBxH.mjs";
import { r as verifyToken } from "./chunks/auth_DnsCpOq1.mjs";
//#region src/middleware.ts
var protectedPaths = [
	"/blog",
	"/es/blog",
	"/en/blog"
];
function isProtected(pathname) {
	return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(defineMiddleware(async (context, next) => {
	if (isProtected(context.url.pathname)) {
		const token = context.cookies.get("auth-token")?.value;
		if (!token) return context.redirect("/login");
		if (!await verifyToken(token)) {
			context.cookies.delete("auth-token", { path: "/" });
			return context.redirect("/login");
		}
	}
	return next();
}));
//#endregion
export { onRequest };
