import { useState, useEffect } from 'react';

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'services', 'blog', 'contact'] as const;

export type ActiveSection = (typeof SECTION_IDS)[number];

export function useActiveSection(): ActiveSection {
  const [active, setActive] = useState<ActiveSection>('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as ActiveSection);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    observers.push(observer);

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, []);

  return active;
}
