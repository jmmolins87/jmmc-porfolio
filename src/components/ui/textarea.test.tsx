// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDefined();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('applies default classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.className).toContain('rounded-xl');
    expect(textarea.className).toContain('min-h-[120px]');
    expect(textarea.className).toContain('resize-y');
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.className).toContain('custom-class');
  });

  it('forwards placeholder text', () => {
    render(<Textarea placeholder="Write something..." />);
    const textarea = screen.getByPlaceholderText('Write something...');
    expect(textarea).toBeDefined();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).disabled).toBe(true);
  });

  it('forwards additional HTML attributes', () => {
    render(<Textarea data-testid="test-area" rows={5} />);
    const textarea = screen.getByTestId('test-area');
    expect(textarea.getAttribute('rows')).toBe('5');
  });
});
