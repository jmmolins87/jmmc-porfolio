import { describe, it, expect } from 'vitest';

describe('UI barrel exports', () => {
  it('exports Button component', async () => {
    const mod = await import('./index');
    expect(mod.Button).toBeDefined();
    expect(typeof mod.Button === 'function' || typeof mod.Button === 'object').toBe(true);
  });

  it('exports buttonVariants function', async () => {
    const mod = await import('./index');
    expect(mod.buttonVariants).toBeDefined();
    expect(typeof mod.buttonVariants).toBe('function');
  });

  it('exports Input component', async () => {
    const mod = await import('./index');
    expect(mod.Input).toBeDefined();
    expect(typeof mod.Input === 'function' || typeof mod.Input === 'object').toBe(true);
  });

  it('exports Textarea component', async () => {
    const mod = await import('./index');
    expect(mod.Textarea).toBeDefined();
    expect(typeof mod.Textarea === 'function' || typeof mod.Textarea === 'object').toBe(true);
  });

  it('exports Label component', async () => {
    const mod = await import('./index');
    expect(mod.Label).toBeDefined();
    expect(typeof mod.Label === 'function' || typeof mod.Label === 'object').toBe(true);
  });
});
