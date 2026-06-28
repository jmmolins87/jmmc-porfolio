interface LenisInstance {
  scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void;
  stop: () => void;
  start: () => void;
}

let lenisInstance: LenisInstance | null = null;
let _programmaticScroll = false;

export function setLenis(lenis: LenisInstance | null) {
  lenisInstance = lenis;
}

export function stopLenis() {
  lenisInstance?.stop();
}

export function startLenis() {
  lenisInstance?.start();
}

export function isProgrammaticScroll() {
  return _programmaticScroll;
}

export function scrollTo(target: string, options?: { offset?: number }) {
  const el = document.getElementById(target);
  if (!el) return;

  _programmaticScroll = true;

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

  setTimeout(() => { _programmaticScroll = false; }, 1500);
}
