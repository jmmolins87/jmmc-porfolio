import { marked } from 'marked';

export function renderMarkdown(md: string): string {
  if (!md) return '<div class="prose prose-sm max-w-none"></div>';
  const html = marked.parse(md) as string;
  return `<div class="prose prose-sm max-w-none">${html}</div>`;
}

export function calcReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
