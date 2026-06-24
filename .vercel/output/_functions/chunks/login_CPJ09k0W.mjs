import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as validateCredentials, t as createToken } from "./auth_COlWRysU.mjs";
//#region src/pages/api/login.ts
var login_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies }) => {
	try {
		const formData = await request.formData();
		const username = formData.get("username");
		const password = formData.get("password");
		if (!username || !password) return new Response(JSON.stringify({ error: "Usuario y contraseña requeridos" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!validateCredentials(username, password)) return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		const token = await createToken(username);
		cookies.set("auth-token", token, {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 3600 * 24 * 7
		});
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/login@_@ts
var page = () => login_exports;
//#endregion
export { page };
