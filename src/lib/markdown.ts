export function renderMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>');

  html = html.replace(/^(?!<[hou])(?!<\/p>)(.+)$/gm, '<p>$1</p>');
  html = html.replace(/(<p>)?(<\/?[hou].*?>)(<\/p>)?/g, '$2');
  html = html.replace(/<p><\/p>/g, '');

  return `<div class="prose prose-sm max-w-none">${html}</div>`;
}
