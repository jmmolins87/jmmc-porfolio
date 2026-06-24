import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as renderTemplate, F as createAstro, I as createComponent, M as addAttribute, j as renderHead, w as renderScript } from "./fetch-state_pc5rxr9W.mjs";
import "./compiler_CAoH7IJf.mjs";
import { n as t, t as detectLocale } from "./globals_DXUUupdJ.mjs";
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://jmmc.vercel.app");
var $$Login = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Login;
	const locale = detectLocale(Astro.request.headers.get("accept-language") || "");
	return renderTemplate`<html${addAttribute(locale, "lang")}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${t(locale, "login.title")}</title><meta name="robots" content="noindex, nofollow"><script>
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
    <\/script>${renderHead($$result)}</head><body class="noise-bg min-h-screen antialiased selection:bg-primary selection:text-primary-foreground flex items-center justify-center"><div class="w-full max-w-sm mx-auto px-4"><div class="rounded-2xl border border-border bg-card p-8"><div class="text-center mb-8"><a href="/" class="text-2xl font-bold tracking-tight hover:text-primary transition-colors">JMMC</a><p class="text-sm text-muted-foreground mt-2">${t(locale, "login.access")}</p></div><div id="error-alert" class="hidden mb-4 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert"></div><form id="login-form" class="space-y-4"><div><label for="username" class="block text-sm font-medium mb-1 text-foreground">${t(locale, "login.username")}</label><input id="username" name="username" type="text" required autocomplete="username" class="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"${addAttribute(t(locale, "login.username"), "placeholder")}></div><div><label for="password" class="block text-sm font-medium mb-1 text-foreground">${t(locale, "login.password")}</label><div class="relative"><input id="password" name="password" type="password" required autocomplete="current-password" class="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"${addAttribute(t(locale, "login.password"), "placeholder")}><button type="button" id="toggle-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"${addAttribute(t(locale, "login.showPassword"), "aria-label")} tabindex="-1"><svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg><svg id="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg></button></div></div><div class="flex justify-end"><button type="button" id="forgot-password" class="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">${t(locale, "login.forgot")}</button></div><button type="submit" class="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">${t(locale, "login.enter")}</button></form></div></div>${renderScript($$result, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/login.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/login.astro", void 0);
var $$file = "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
