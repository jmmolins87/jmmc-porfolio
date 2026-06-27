// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setLenis, stopLenis, startLenis, scrollTo } from './scroll';

beforeEach(() => {
  document.body.innerHTML =
    '<div id="target" style="height: 100px;"></div><div id="small" style="height: 50px;"></div>';
  window.innerHeight = 800;

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

afterEach(() => {
  setLenis(null);
});

describe('setLenis', () => {
  it('stores a lenis instance', () => {
    const mockLenis = { scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() };
    setLenis(mockLenis);
    stopLenis();
    expect(mockLenis.stop).toHaveBeenCalled();
  });

  it('accepts null to clear the instance', () => {
    const mockLenis = { scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() };
    setLenis(mockLenis);
    setLenis(null);
    stopLenis();
    expect(mockLenis.stop).not.toHaveBeenCalled();
  });
});

describe('scrollTo', () => {
  it('does nothing for a non-existent element', () => {
    expect(() => scrollTo('nonexistent')).not.toThrow();
  });

  it('falls back to scrollIntoView without Lenis', () => {
    const el = document.getElementById('target')!;
    scrollTo('target');
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });

  it('uses Lenis when available', () => {
    const el = document.getElementById('target')!;
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, right: 0, bottom: 100, width: 0, height: 100,
    } as DOMRect);

    const scrollToMock = vi.fn();
    const mockLenis = { scrollTo: scrollToMock, stop: vi.fn(), start: vi.fn() };
    setLenis(mockLenis);

    scrollTo('target');
    expect(scrollToMock).toHaveBeenCalledWith('#target', { offset: -350 });
  });

  it('uses default offset for small elements with Lenis', () => {
    const el = document.getElementById('small')!;
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, right: 0, bottom: 50, width: 0, height: 50,
    } as DOMRect);

    const scrollToMock = vi.fn();
    const mockLenis = { scrollTo: scrollToMock, stop: vi.fn(), start: vi.fn() };
    setLenis(mockLenis);

    scrollTo('small');
    expect(scrollToMock).toHaveBeenCalledWith('#small', { offset: -375 });
  });

  it('respects a custom offset, overriding the default calculation', () => {
    const scrollToMock = vi.fn();
    const mockLenis = { scrollTo: scrollToMock, stop: vi.fn(), start: vi.fn() };
    setLenis(mockLenis);

    scrollTo('target', { offset: 50 });
    expect(scrollToMock).toHaveBeenCalledWith('#target', { offset: 50 });
  });
});

describe('stopLenis', () => {
  it('calls stop on the lenis instance', () => {
    const stopMock = vi.fn();
    setLenis({ scrollTo: vi.fn(), stop: stopMock, start: vi.fn() });
    stopLenis();
    expect(stopMock).toHaveBeenCalled();
  });

  it('does not throw when lenis is null', () => {
    setLenis(null);
    expect(() => stopLenis()).not.toThrow();
  });
});

describe('startLenis', () => {
  it('calls start on the lenis instance', () => {
    const startMock = vi.fn();
    setLenis({ scrollTo: vi.fn(), stop: vi.fn(), start: startMock });
    startLenis();
    expect(startMock).toHaveBeenCalled();
  });

  it('does not throw when lenis is null', () => {
    setLenis(null);
    expect(() => startLenis()).not.toThrow();
  });
});
