import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins class names together', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles a single class', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles conditional classes via objects', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles conditional classes that are truthy', () => {
    expect(cn('base', true && 'extra')).toBe('base extra');
  });

  it('resolves Tailwind class conflicts (later wins)', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('resolves padding conflicts correctly', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('preserves non-conflicting classes', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false, null, undefined, 0, 'bar')).toBe('foo bar');
  });
});
