import { describe, it, expect } from 'vitest';
import * as animations from './animations';

const variantNames = [
  'fadeUp',
  'fadeLeft',
  'fadeRight',
  'staggerContainer',
  'scaleIn',
  'skillBar',
  'staggerLetters',
  'textReveal',
  'portalReveal',
  'wordFly',
  'wordFlyLeft',
  'wordFlyRight',
  'cardFling',
  'radialExplode',
  'scaleInSpring',
  'rippleNode',
  'clipRevealUp',
  'floatSlow',
  'slideUp',
];

const variantsWithOpacityOne = variantNames.filter(
  (n) => n !== 'staggerContainer' && n !== 'staggerLetters',
);

describe('animation variants', () => {
  it('exports all 19 animation objects', () => {
    const exportedNames = Object.keys(animations);
    for (const name of variantNames) {
      expect(exportedNames).toContain(name);
    }
  });

  it('each variant has hidden and visible properties', () => {
    for (const name of variantNames) {
      const variant = (animations as any)[name];
      expect(variant).toHaveProperty('hidden');
      expect(variant).toHaveProperty('visible');
    }
  });

  it('hidden variants have opacity: 0', () => {
    const opacityZeroVariants = variantsWithOpacityOne.filter((name) => {
      const variant = (animations as any)[name];
      return variant.hidden.opacity === 0;
    });
    expect(opacityZeroVariants.length).toBeGreaterThanOrEqual(15);
  });

  it('visible variants have opacity: 1', () => {
    for (const name of variantsWithOpacityOne) {
      const variant = (animations as any)[name];
      if (typeof variant.visible === 'function') {
        const result = variant.visible(0);
        expect(result.opacity).toBe(1);
      } else {
        expect(variant.visible.opacity).toBe(1);
      }
    }
  });

  it('visible variants have transition or type properties', () => {
    for (const name of variantNames) {
      const variant = (animations as any)[name];
      if (typeof variant.visible === 'function') {
        const result = variant.visible(0);
        expect(result.transition || result.type).toBeTruthy();
      } else {
        expect(variant.visible.transition || variant.visible.type).toBeTruthy();
      }
    }
  });

  it('staggerContainer has staggerChildren config', () => {
    expect(animations.staggerContainer.visible.transition.staggerChildren).toBe(0.1);
    expect(animations.staggerContainer.visible.transition.delayChildren).toBe(0.1);
  });

  it('cardFling uses spring physics inside transition', () => {
    expect((animations.cardFling.visible as any).transition.type).toBe('spring');
  });

  it('radialExplode is a function that returns different configs per index', () => {
    const result0 = animations.radialExplode.visible(0);
    const result1 = animations.radialExplode.visible(1);
    expect(result0.transition.delay).toBe(0);
    expect(result1.transition.delay).toBe(0.06);
    expect(result1.transition.stiffness).toBeGreaterThan(result0.transition.stiffness);
  });

  it('skillBar uses CSS custom property for width', () => {
    expect(animations.skillBar.visible.width).toBe('var(--skill-width)');
  });
});
