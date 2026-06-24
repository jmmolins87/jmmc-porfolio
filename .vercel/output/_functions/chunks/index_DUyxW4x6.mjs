import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as maybeRenderHead, D as renderTemplate, I as createComponent, M as addAttribute, T as renderComponent } from "./fetch-state_DCNjDBxH.mjs";
import "./compiler_BmoE8rpE.mjs";
import { n as t } from "./globals_DtL64wfI.mjs";
import { t as $$BaseLayout } from "./BaseLayout_Bamyr-nT.mjs";
import { t as getCollection } from "./_astro_content_DIFgVWnt.mjs";
//#region src/pages/blog/index.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const lang = "es";
	const sorted = (await getCollection("blog", ({ data }) => data.lang === lang)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"locale": "es",
		"title": "Blog | Juanma MC"
	}, { "default": async ($$result) => renderTemplate`
  ${maybeRenderHead($$result)}<main class="pt-24 pb-24"><div class="section-container"><h1 class="section-title mb-12">Blog</h1><div class="max-w-3xl mx-auto space-y-6">${sorted.map((post) => renderTemplate`<a${addAttribute(`/blog/${post.id}`, "href")} class="block group rounded-2xl border border-border bg-card p-6 hover:glow-sm transition-all duration-300"><div class="flex items-center gap-4 text-sm text-muted-foreground mb-3"><time${addAttribute(post.data.date.toISOString(), "datetime")}>${post.data.date.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric"
	})}</time><span>${post.data.readTime} ${t("es", "blog.minRead")}</span></div><h2 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">${post.data.title}</h2><p class="text-muted-foreground text-sm mb-4 line-clamp-2">${post.data.description}</p><div class="flex flex-wrap gap-1.5">${post.data.tags.map((tag) => renderTemplate`<span class="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">${tag}</span>`)}</div></a>`)}</div></div></main>
` })}`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/blog/index.astro", void 0);
var $$file = "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/blog/index.astro";
var $$url = "/blog";
//#endregion
//#region \0virtual:astro:page:src/pages/blog/index@_@astro
var page = () => blog_exports;
//#endregion
export { page };
