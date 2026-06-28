import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@/lib/markdown';

describe('renderMarkdown', () => {
  it('wraps output in prose div', () => {
    const result = renderMarkdown('Hello');
    expect(result).toMatch(/^<div class="prose prose-sm max-w-none">.*<\/div>$/s);
  });

  it('renders h1 headings', () => {
    const result = renderMarkdown('# Title');
    expect(result).toContain('<h1>Title</h1>');
  });

  it('renders h2 headings', () => {
    const result = renderMarkdown('## Subtitle');
    expect(result).toContain('<h2>Subtitle</h2>');
  });

  it('renders h3 headings', () => {
    const result = renderMarkdown('### Section');
    expect(result).toContain('<h3>Section</h3>');
  });

  it('renders bold text', () => {
    const result = renderMarkdown('This is **bold** text');
    expect(result).toContain('<strong>bold</strong>');
  });

  it('renders inline code', () => {
    const result = renderMarkdown('Use the `foo()` function');
    expect(result).toContain('<code>foo()</code>');
  });

  it('renders unordered list items', () => {
    const result = renderMarkdown('- Item 1\n- Item 2\n- Item 3');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
    expect(result).toContain('<li>Item 3</li>');
    expect(result).toContain('</ul>');
  });

  it('renders paragraphs for plain text', () => {
    const result = renderMarkdown('First paragraph\n\nSecond paragraph');
    expect(result).toContain('<p>First paragraph</p>');
    expect(result).toContain('<p>Second paragraph</p>');
  });

  it('handles empty string', () => {
    const result = renderMarkdown('');
    expect(result).toBe('<div class="prose prose-sm max-w-none"></div>');
  });

  it('handles mixed content correctly', () => {
    const md = '# Title\n\nSome **bold** text\n\n- List item';
    const result = renderMarkdown(md);
    expect(result).toContain('<h1>Title</h1>');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<li>List item</li>');
  });

  it('handles malformed markdown gracefully', () => {
    const result = renderMarkdown('**unclosed bold');
    expect(result).not.toContain('undefined');
  });
});
