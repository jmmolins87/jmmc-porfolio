# jmmc-portfolio

Portfolio personal de Juanma MC — Fullstack Developer, AI & Automation Builder.

Built with [Astro](https://astro.build), React, TypeScript, and Tailwind CSS.

## Stack

- **Framework**: Astro 7 (SSR con Vercel adapter)
- **UI**: React 19, Tailwind CSS 4, Motion
- **Auth**: JWT con jose, cookie httpOnly
- **Content**: Content Collections (Astro Content Layer API)
- **i18n**: Sistema de traducciones ES/EN
- **Deploy**: Vercel

## Development

```bash
# Start dev server
astro dev --background

# Build
npm run build

# Type check
npx astro check
```

## Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer
│   ├── sections/     # Hero, About, Skills, Timeline, Projects, Services, Blog, Contact
│   └── ui/           # Badge, Button, Sheet, etc.
├── content/
│   ├── blog/         # Artículos del blog (ES/EN)
│   └── i18n/         # Traducciones (es.json, en.json)
├── layouts/          # BaseLayout
├── lib/              # auth, i18n, utils, animations
└── pages/            # Rutas (/, /es/, /en/, /blog/, /login)
```

## Environment

```bash
BLOG_USER=          # Usuario para acceso al blog
BLOG_PASSWORD=      # Contraseña para acceso al blog
JWT_SECRET=         # Secreto para firmar JWT
PUBLIC_SITE_URL=    # URL del sitio (para SEO)
```
