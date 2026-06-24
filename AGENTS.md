## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

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
- **Twitter → X**: Actualizar icono, label y enlaces en `icons.tsx`, `Footer.tsx`, `Contact.tsx`, `Hero.tsx`
- **404**: Página personalizada `src/pages/404.astro`
- **Hero CTA**: ScrollIntoView sin conflicto con Lenis en `Hero.tsx`, `Header.tsx`
- **Login i18n**: Login hardcodeado en español, migrar a i18n

### Fase 6: Rendimiento
- **Hydration**: `client:load` → `client:visible`/`client:idle` en componentes below the fold
- **Imágenes**: `loading="lazy"` + `width`/`height` en `About.tsx`, `Projects.tsx`
- **Partículas**: Reducir en móvil, respetar `prefers-reduced-motion`
- **Preconnect**: Hints para recursos externos en `BaseLayout.astro`
- **Lenis**: Resolver conflicto scroll-behavior smooth + scrollIntoView

### Fase 7: SEO y Accesibilidad
- **theme-color**: Meta tag en `BaseLayout.astro`
- **hreflang**: x-default apunta a `/es/` en vez de `/`
- **aria-label**: Canvas partículas en `Hero.tsx`
- **aria-describedby**: Errores formulario en `Contact.tsx`
- **viewport-fit=cover**: iOS notched en `BaseLayout.astro`
- **Site URL**: Variable de entorno `PUBLIC_SITE_URL`
