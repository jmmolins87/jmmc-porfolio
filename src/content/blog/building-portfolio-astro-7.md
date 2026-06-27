---
title: "Building My Portfolio with Astro 7"
description: "Why I chose Astro 7 for my portfolio, how I set up SSR, content collections, and why it's the best framework for content sites."
date: 2026-06-05
tags: ["Astro", "Portfolio", "SSR", "Web"]
readTime: "6 min"
lang: "en"
---

## Why Astro

After years using React, Next.js, and Angular for professional projects, I wanted something different for my portfolio. Something fast, modern, with a great developer experience. Astro 7 delivered on all fronts.

## SSR + prerender

My portfolio uses `output: 'server'` for blog routes (login-protected) and prerender for everything else. This gives me the best of both worlds: blazing fast static pages and dynamic content when needed.

## Content Layer API

Astro 7's new Content Layer API is incredible. Defining collections with Zod schemas, loading markdown with glob patterns, and rendering with full type safety. No more complex configuration.

## Real performance

- Lighthouse: 100 across all metrics
- First Contentful Paint: < 0.5s
- Lazy-loaded images and smooth scrolling with Lenis provide a fluid experience

## Conclusion

Astro 7 is my number one recommendation for portfolios, blogs, and content sites. If you're coming from Next.js or Gatsby, you'll be amazed at how straightforward it is to achieve excellent performance with zero configuration.
