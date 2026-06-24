import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as maybeRenderHead, D as renderTemplate, F as createAstro, I as createComponent, M as addAttribute, T as renderComponent } from "./fetch-state_DCNjDBxH.mjs";
import "./compiler_BmoE8rpE.mjs";
import { n as t } from "./globals_DtL64wfI.mjs";
import { t as $$BaseLayout } from "./BaseLayout_Bamyr-nT.mjs";
import { n as getEntry, r as renderEntry } from "./_astro_content_DIFgVWnt.mjs";
//#region src/pages/blog/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://jmmc.vercel.app");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	if (!slug) return Astro.redirect("/blog");
	const post = await getEntry("blog", slug);
	if (!post) return Astro.redirect("/blog");
	const { Content } = await renderEntry(post);
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"locale": post.data.lang,
		"title": `${post.data.title} | Blog | Juanma MC`
	}, { "default": async ($$result) => renderTemplate`
  ${maybeRenderHead($$result)}<main class="pt-24 pb-24"><div class="section-container"><article class="max-w-3xl mx-auto"><div class="mb-8"><a href="/blog" class="text-sm text-primary hover:underline mb-4 inline-block">← Volver al blog</a><h1 class="text-3xl md:text-4xl font-bold mb-4">${post.data.title}</h1><div class="flex items-center gap-4 text-sm text-muted-foreground"><time${addAttribute(post.data.date.toISOString(), "datetime")}>${post.data.date.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric"
	})}</time><span>${post.data.readTime} ${t("es", "blog.minRead")}</span></div><div class="flex flex-wrap gap-1.5 mt-4">${post.data.tags.map((tag) => renderTemplate`<span class="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">${tag}</span>`)}</div></div><div class="prose prose-neutral dark:prose-invert max-w-none">${renderComponent($$result, "Content", Content, {})}</div></article></div></main>
` })}`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/blog/[slug].astro", void 0);
var $$file = "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/blog/[slug].astro";
var $$url = "/blog/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/blog/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
