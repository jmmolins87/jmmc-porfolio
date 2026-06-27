// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './theme-provider';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  document.documentElement.className = '';
  document.documentElement.style.colorScheme = '';
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('dark'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTheme', () => {
  it('defaults to system when no stored theme is found', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('applies light class to html element when theme is light', () => {
    const { result } = renderHook(() => useTheme());

    act(() => { result.current.setTheme('light'); });
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('applies dark class to html element when theme is dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => { result.current.setTheme('dark'); });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('uses dark system preference when prefers-color-scheme is dark', () => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    const { result } = renderHook(() => useTheme());

    act(() => { result.current.setTheme('system'); });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('uses light system preference when prefers-color-scheme is light', () => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    const { result } = renderHook(() => useTheme());

    act(() => { result.current.setTheme('system'); });
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('reads stored theme from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');
    const { result } = renderHook(() => useTheme());
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    expect(result.current.theme).toBe('dark');
  });

  it('setTheme updates the current theme state', () => {
    const { result } = renderHook(() => useTheme());

    act(() => { result.current.setTheme('dark'); });
    expect(result.current.theme).toBe('dark');

    act(() => { result.current.setTheme('light'); });
    expect(result.current.theme).toBe('light');

    act(() => { result.current.setTheme('system'); });
    expect(result.current.theme).toBe('system');
  });
});
