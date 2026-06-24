import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/contact.ts
var contact_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	try {
		const { name, email, message } = await request.json();
		if (!name || !email || !message) return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		console.log("[Contact]", {
			name,
			email,
			message
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
//#region \0virtual:astro:page:src/pages/api/contact@_@ts
var page = () => contact_exports;
//#endregion
export { page };
