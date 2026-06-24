import { D as renderTemplate, E as renderSlot, F as createAstro, I as createComponent, M as addAttribute, P as unescapeHTML, T as renderComponent, j as renderHead } from "./fetch-state_DCNjDBxH.mjs";
import "./compiler_BmoE8rpE.mjs";
import { n as t } from "./globals_DtL64wfI.mjs";
//#region src/layouts/BaseLayout.astro
createAstro("https://jmmc.vercel.app");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { locale } = Astro.props;
	const title = Astro.props.title ?? t(locale, "seo.title");
	const description = Astro.props.description ?? t(locale, "seo.description");
	const ogTitle = Astro.props.ogTitle ?? t(locale, "seo.ogTitle");
	const ogDescription = Astro.props.ogDescription ?? t(locale, "seo.ogDescription");
	const ogImage = Astro.props.ogImage ?? "https://jmmc.vercel.app/og-image.jpg";
	const siteUrl = "https://jmmc.vercel.app";
	const canonical = `${siteUrl}/${locale}/`;
	return renderTemplate`<html${addAttribute(locale, "lang")}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="author" content="Juanma MC"><meta name="creator" content="Juanma MC"><meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"><link rel="canonical"${addAttribute(canonical, "href")}><link rel="alternate" hreflang="es"${addAttribute(`${siteUrl}/es/`, "href")}><link rel="alternate" hreflang="en"${addAttribute(`${siteUrl}/en/`, "href")}><link rel="alternate" hreflang="x-default"${addAttribute(`${siteUrl}/es/`, "href")}><meta property="og:title"${addAttribute(ogTitle, "content")}><meta property="og:description"${addAttribute(ogDescription, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:site_name" content="Juanma MC Portfolio"><meta property="og:locale"${addAttribute(locale === "es" ? "es_ES" : "en_US", "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(ogTitle, "content")}><meta name="twitter:description"${addAttribute(ogDescription, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="shortcut icon" href="/favicon_light.ico"><script>
      (function() {
        var theme = localStorage.getItem('theme');
        var resolved = 'system';
        if (theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          resolved = 'dark';
        } else {
          resolved = 'light';
        }
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
      })();
    <\/script><script type="application/ld+json">${unescapeHTML(JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Juanma MC",
		"url": siteUrl,
		"image": ogImage,
		"jobTitle": "Fullstack Developer",
		"knowsAbout": [
			"Web Development",
			"AI",
			"Automation",
			"React",
			"Node.js",
			"TypeScript"
		],
		"sameAs": ["https://github.com/juanmamc", "https://linkedin.com/in/juanmamc"]
	}))}<\/script>${renderHead($$result)}</head><body class="noise-bg min-h-screen antialiased selection:bg-primary selection:text-primary-foreground"><a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">${locale === "es" ? "Saltar al contenido principal" : "Skip to main content"}</a><div id="main-content">${renderSlot($$result, $$slots["default"])}</div>${renderComponent($$result, "SmoothScroll", null, {
		"client:only": "react",
		"client:component-hydration": "only",
		"client:component-path": "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/components/SmoothScroll",
		"client:component-export": "default"
	})}</body></html>`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { $$BaseLayout as t };
