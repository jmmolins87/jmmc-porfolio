// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
  });

  it('applies default classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('rounded-xl');
    expect(input.className).toContain('border-border');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-class');
  });

  it('sets the type attribute', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('type')).toBe('email');
  });

  it('does not explicitly set type when not provided', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    // HTML spec defaults to 'text' when type is not specified,
    // but the attribute itself is not set in the DOM
    expect(input.getAttribute('type')).toBeNull();
  });

  it('forwards placeholder text', () => {
    render(<Input placeholder="Enter name" />);
    const input = screen.getByPlaceholderText('Enter name');
    expect(input).toBeDefined();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect((input as HTMLInputElement).disabled).toBe(true);
  });

  it('forwards additional HTML attributes', () => {
    render(<Input data-testid="test-input" readOnly />);
    const input = screen.getByTestId('test-input');
    expect((input as HTMLInputElement).readOnly).toBe(true);
  });
});
