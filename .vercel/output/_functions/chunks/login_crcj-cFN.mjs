import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as renderTemplate, I as createComponent, j as renderHead, w as renderScript } from "./fetch-state_BoCD520l.mjs";
import "./compiler_DyFx8Fte.mjs";
/* empty css                  */
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
var $$Login = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login | Juanma MC</title><meta name="robots" content="noindex, nofollow"><script>
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
    <\/script>${renderHead($$result)}</head><body class="noise-bg min-h-screen antialiased selection:bg-primary selection:text-primary-foreground flex items-center justify-center"><div class="w-full max-w-sm mx-auto px-4"><div class="rounded-2xl border border-border bg-card p-8"><div class="text-center mb-8"><a href="/" class="text-2xl font-bold tracking-tight hover:text-primary transition-colors">JMMC</a><p class="text-sm text-muted-foreground mt-2">Acceso al Blog</p></div><form id="login-form" class="space-y-4"><div><label for="username" class="block text-sm font-medium mb-1 text-foreground">Usuario</label><input id="username" name="username" type="text" required class="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Usuario"></div><div><label for="password" class="block text-sm font-medium mb-1 text-foreground">Contraseña</label><input id="password" name="password" type="password" required class="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contraseña"></div><button type="submit" class="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">Entrar</button><p id="error-msg" class="text-sm text-destructive text-center hidden"></p></form></div></div>${renderScript($$result, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/login.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/login.astro", void 0);
var $$file = "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
