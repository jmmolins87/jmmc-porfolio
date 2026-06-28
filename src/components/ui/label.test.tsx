// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('renders a label element', () => {
    render(<Label>Name</Label>);
    const label = screen.getByText('Name');
    expect(label).toBeDefined();
    expect(label.tagName).toBe('LABEL');
  });

  it('applies default classes', () => {
    render(<Label>Label</Label>);
    const label = screen.getByText('Label');
    expect(label.className).toContain('text-sm');
    expect(label.className).toContain('font-medium');
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Styled</Label>);
    const label = screen.getByText('Styled');
    expect(label.className).toContain('custom-class');
  });

  it('forwards htmlFor attribute', () => {
    render(<Label htmlFor="email">Email</Label>);
    const label = screen.getByText('Email');
    expect(label.getAttribute('for')).toBe('email');
  });
});
