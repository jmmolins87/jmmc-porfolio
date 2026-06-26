let lenisInstance: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } | null = null;

export function setLenis(lenis: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } | null) {
  lenisInstance = lenis;
}

export function scrollTo(target: string, options?: { offset?: number }) {
  const el = document.getElementById(target);
  if (!el) return;

  if (lenisInstance) {
    const viewportHeight = window.innerHeight;
    const elementHeight = el.getBoundingClientRect().height;
    let offset = options?.offset ?? 0;

    if (options?.offset === undefined && elementHeight <= viewportHeight) {
      offset = -(viewportHeight - elementHeight) / 2;
    }

    lenisInstance.scrollTo('#' + target, { offset });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
