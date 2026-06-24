let lenisInstance: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } | null = null;

export function setLenis(lenis: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } | null) {
  lenisInstance = lenis;
}

export function scrollTo(target: string, options?: { offset?: number }) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  } else {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
