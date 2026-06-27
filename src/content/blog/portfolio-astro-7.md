---
title: "Construyendo mi Portfolio con Astro 7"
description: "Por qué elegí Astro 7 para mi portfolio, cómo configuré SSR, content collections y por qué es el mejor framework para sitios de contenido."
date: 2026-06-05
tags: ["Astro", "Portfolio", "SSR", "Web"]
readTime: "6 min"
lang: "es"
---

## Por qué Astro

Después de años usando React, Next.js y Angular para proyectos profesionales, quería algo diferente para mi portfolio. Algo rápido, moderno y con buena experiencia de desarrollo. Astro 7 cumplía todo.

## SSR + prerender

Mi portfolio usa `output: 'server'` para las rutas de blog (protegidas con login) y prerender para el resto. Esto me da lo mejor de ambos mundos: páginas estáticas ultrarrápidas y contenido dinámico cuando lo necesito.

## Content Layer API

La nueva API de Content Layer de Astro 7 es increíble. Definir colecciones con esquemas Zod, cargar markdown con glob patterns y renderizarlo con tipado completo. No más configuraciones complejas.

## Rendimiento real

- Lighthouse: 100 en todas las métricas
- First Contentful Paint: < 0.5s
- Las imágenes con lazy loading y el scroll suave con Lenis dan una experiencia fluida

## Conclusión

Astro 7 es mi recomendación número uno para portfolios, blogs y sitios de contenido. Si vienes de Next.js o Gatsby, te sorprenderá lo sencillo que es conseguir un rendimiento excelente sin configuración.
