interface LenisInstance {
  scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void;
  stop: () => void;
  start: () => void;
}

let lenisInstance: LenisInstance | null = null;

export function setLenis(lenis: LenisInstance | null) {
  lenisInstance = lenis;
}

export function stopLenis() {
  lenisInstance?.stop();
}

export function startLenis() {
  lenisInstance?.start();
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
