import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as maybeRenderHead, D as renderTemplate, F as createAstro, I as createComponent, T as renderComponent } from "./fetch-state_DCNjDBxH.mjs";
import "./compiler_BmoE8rpE.mjs";
import { t as detectLocale } from "./globals_DtL64wfI.mjs";
import { t as $$BaseLayout } from "./BaseLayout_Bamyr-nT.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://jmmc.vercel.app");
var $$404 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$404;
	const locale = detectLocale(Astro.request.headers.get("accept-language") || "");
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"locale": locale,
		"title": "404",
		"description": "Page not found"
	}, { "default": ($$result) => renderTemplate`
  ${maybeRenderHead($$result)}<main class="min-h-screen flex items-center justify-center"><div class="section-container text-center"><h1 class="text-8xl font-bold text-gradient mb-4">404</h1><p class="text-xl text-muted-foreground mb-8">${locale === "es" ? "Página no encontrada" : "Page not found"}</p><a href="/" class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">${locale === "es" ? "Volver al inicio" : "Back to home"}</a></div></main>
` })}`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/404.astro", void 0);
var $$file = "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
