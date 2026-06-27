## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Rules (always follow)

- **Never commit build artifacts**: `coverage/`, `dist/`, `.astro/`, `node_modules/` must always be in `.gitignore`. If you generate `coverage/` via `vitest --coverage`, verify `.gitignore` has `coverage/` before any git operation.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Changelog

### Fase 1: Datos Reales
- **Timeline**: Reemplazados 2 entries placeholder por 6 experiencias reales (Custos Mobile, Accenture, ViewNext, Dimática, Nateevo, Everis) con traducciones ES/EN
- **Projects**: Reemplazados 4 proyectos placeholder por 18 proyectos reales con screenshots de `public/projects/`
- **About**: Imagen placeholder "JM" → foto real `/imgs/me.png`. Contadores actualizados (18 proyectos, 6 clientes, 7 años)
- **Limpieza**: Imports no usados eliminados en Header, Projects, Timeline. Error TS `suppressHydrationWarning` corregido en BaseLayout

### Fase 2: Blog con Membresía
- **SSR**: Cambiado a `output: 'server'` con adapter `@astrojs/vercel`. Páginas estáticas marcadas con `prerender: true`
- **Auth JWT**: `src/lib/auth.ts` con `jose` para JWT (7 días de expiración), comparación timing-safe de credenciales
- **Middleware**: `src/middleware.ts` protege rutas `/blog/*`, redirige a `/login` si no hay token válido
- **Login**: `src/pages/login.astro` con formulario, POST a `/api/login`, redirect a `/blog`
- **API Login**: `src/pages/api/login.ts` valida credenciales vía `BLOG_USER`/`BLOG_PASSWORD` env vars, setea cookie httpOnly
- **Content Collections**: Migrado a Astro 7 Content Layer API (`src/content.config.ts` con `glob()` loader)
- **Blog pages**: `src/pages/blog/index.astro` (listado) y `src/pages/blog/[slug].astro` (post individual), ambos protegidos
- **Artículo inicial**: "Cómo la IA está transformando el desarrollo de software" (ES + EN) en `src/content/blog/`
- **Variables de entorno**: `BLOG_USER`, `BLOG_PASSWORD`, `JWT_SECRET` en `.env.example`
- **Login UI**: Icono ojo para mostrar/ocultar contraseña, botón "¿Has olvidado la contraseña?" con mensaje de contacto, alertas rojas en caja de login

### Fase 3: Bugs Críticos
- **Contact Form**: Reemplazado Formspree placeholder por endpoint propio `/api/contact`
- **Blog section**: Artículos hardcodeados reemplazados por datos dinámicos desde content collections (pasa `posts` como prop desde las páginas Astro)
- **og-image.jpg**: Creada imagen OG 1200×630px en `public/og-image.jpg`
- **favicon_light.ico**: Movido de `public/legacy/misc/` a `public/favicon_light.ico`

### Fase 4: Limpieza y Deuda Técnica
- **Deps**: Eliminar `@radix-ui/react-dropdown-menu` (no usado). Mover `@types/react`, `@types/react-dom` a devDependencies
- **Card**: Eliminar `src/components/ui/card.tsx` si no se usa
- **i18n**: Eliminar claves muertas `projects.view`, `projects.viewAll` de `es.json`, `en.json`
- **package.json**: Renombrar `name`
- **README.md**: Reemplazar template Astro por defecto con contenido del portfolio

### Fase 5: UX y UI
- **Twitter → X**: Renombrado icono `TwitterIcon` → `XIcon`, actualizados labels y enlaces (`x.com/juanmamc`) en `icons.tsx`, `Footer.tsx`, `Contact.tsx`, `Hero.tsx`
- **404**: Página personalizada `src/pages/404.astro` con detección de idioma
- **Hero CTA**: Creado `src/lib/scroll.ts` con `scrollTo()` que usa Lenis si disponible, fallback a `scrollIntoView`. Actualizados `Hero.tsx` y `Header.tsx`
- **Login i18n**: Login migrado a i18n con `detectLocale()` desde Accept-Language. Añadidas 11 claves de traducción ES/EN

### Fase 6: Rendimiento
- **Hydration**: `client:load` → `client:visible` en componentes below the fold. Header y Hero mantienen `client:load`
- **Imágenes**: `loading="lazy"` + `width`/`height` en `About.tsx`, `Projects.tsx`
- **Partículas**: Reducidas en móvil (20 vs 50), respeta `prefers-reduced-motion` (desactiva si activo)
- **Preconnect**: Hints para recursos externos en `BaseLayout.astro`
- **Lenis**: `scroll-behavior: smooth` → `auto` en globals.css para evitar conflicto con Lenis

### Fase 7: SEO y Accesibilidad
- **theme-color**: Meta tag en `BaseLayout.astro` con media queries para dark/light
- **hreflang**: x-default apunta a `/` en vez de `/es/`
- **aria-label**: Canvas partículas en `Hero.tsx`
- **aria-describedby**: Errores formulario con IDs únicos en `Contact.tsx`
- **viewport-fit=cover**: iOS notched en `BaseLayout.astro`
- **Site URL**: Variable de entorno `PUBLIC_SITE_URL` con fallback a hardcoded

### Fase 9: Testing con Coverage >80%
- **17 test files creados** con 147 tests para todos los `.ts`/`.tsx` del proyecto: auth, i18n, animations, markdown, scroll, utils, theme-provider, middleware, contact-api, login-api, content.config, button, input, label, textarea, y barrel index
- **Coverage thresholds**: Configurado `vitest.config.ts` con `perFile: true` al 80% en statements/branches/functions/lines
- **Patrón co-located tests**: Cada test al lado del source (`src/lib/auth.test.ts` junto a `src/lib/auth.ts`)
- **Per-file env**: Tests DOM usan `// @vitest-environment jsdom`, tests de lógica usan `node` (default)
- **Exclusiones coverage**: JSON de i18n y barrel `index.ts` excluidos del reporte (falsos positivos de v8)
- **Bug .gitignore**: `coverage/` no estaba ignorado y se estaba trackeando — añadido a `.gitignore` y eliminado con `git rm --cached`

### Fase 10: Contacto real con Brevo
- **API Contacto**: `src/pages/api/contact.ts` actualizado para enviar emails reales vía Brevo API (`fetch` nativo, sin dependencias)
- **ToastProvider**: Conectado en `BaseLayout.astro` con `client:load` — antes existía pero no se renderizaba, los toasts nunca aparecían
- **i18n**: Añadida clave `contact.connectionError` en ES/EN (se usaba en el catch pero no existía)
- **Env vars**: `BREVO_API_KEY` añadida a `.env.example` y `.env` local
- **Tests**: 8 tests para contact API cubriendo Brevo success, errores, API key faltante, y parse errors

### Fase 8: Animaciones y UI
- **Animaciones títulos**: Todos los títulos migrados de `useTransform` a `whileInView` + `fadeUp` en About, Skills, Timeline, Projects, Blog, Services, Contact — evita desaparición al centrar sección con Lenis
- **Formulario Contact**: Migrado a `whileInView` para evitar desincronización con Lenis
- **ThemeToggle**: Convertido a dropdown con Light/Dark/System
- **LanguageSwitcher**: Convertido a toggle switch ES/EN
- **Nav mapeo explícito**: `navKeys` pasa de array de strings a `{ key, section }[]` para mapear `home` → `hero`
- **Header logo**: Convertidos SVGs artísticos (viewBox 2437×1489) a PNGs a resolución retina para renderizado fiable en header
- **404 page**: Simplificada a HTML standalone sin dependencias React para evitar error de hidratación en SSR
