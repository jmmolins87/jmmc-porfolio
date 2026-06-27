---
title: "Arquitectura Frontend Moderna: Más Allá de los Frameworks"
description: "Patrones, micro-frontends y gestión de estado. Cómo estructurar aplicaciones frontend que escalan con el tiempo."
date: 2026-06-20
tags: ["Arquitectura", "Frontend", "Angular", "React"]
readTime: "6 min"
lang: "es"
---

## El problema de escalar

Cuando un proyecto frontend crece, el código tiende a desorganizarse. Los componentes se acoplan, los estados se vuelven difíciles de rastrear y cada nueva feature cuesta más. He visto este patrón repetirse en equipos de todos los tamaños.

## Separación por dominios

La clave no está en el framework sino en cómo organizas el código. En lugar de carpetas por tipo (components, services, pipes), agrupa por dominio funcional. Cada módulo debe tener su propia lógica, sus propios tests y su propia responsabilidad. Esto facilita el trabajo en paralelo y reduce los conflictos de merge.

## Micro-frontends con Module Federation

En proyectos grandes, los micro-frontends permiten que distintos equipos trabajen de forma independiente. Con Module Federation de Webpack (o Native Federation para Angular), cada micro-frontend se despliega por separado, con su propio ciclo de vida. He implementado esta arquitectura en el Banco Santander con resultados muy positivos: despliegues independientes, tecnologías mixtas y equipos autónomos.

## Gestión de estado predecible

El estado de la aplicación debe ser la fuente única de verdad. Usa Signal Store (Angular), Zustand (React) o NgRx. La regla de oro: los efectos secundarios van en servicios o middlewares, no en los componentes.

## Conclusión

La arquitectura frontend no es sobre el framework de moda. Es sobre principios: separación de responsabilidades, flujo de datos unidireccional y componentes desacoplados. Domina los principios y podrás cambiar de framework sin miedo.
