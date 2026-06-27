import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDefineCollection = vi.hoisted(() => vi.fn((config: any) => config));
const mockGlob = vi.hoisted(() => vi.fn((config: any) => config));

vi.mock('astro:content', async () => {
  const zod = await vi.importActual('zod');
  return {
    defineCollection: mockDefineCollection,
    z: zod,
  };
});

vi.mock('astro/loaders', () => ({
  glob: mockGlob,
}));

import { collections } from './content.config';

describe('blog content schema', () => {
  let blogSchema: any;

  beforeEach(() => {
    blogSchema = collections.blog.schema;
  });

  it('validates a correct blog entry', () => {
    const validEntry = {
      title: 'Test Post',
      description: 'A test description',
      date: '2024-01-01',
      tags: ['tech', 'javascript'],
      readTime: '5 min',
      lang: 'es',
    };

    const result = blogSchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('accepts optional tags as empty array', () => {
    const entry = {
      title: 'Test',
      description: 'Desc',
      date: '2024-01-01',
      tags: [],
      readTime: '3 min',
      lang: 'en',
    };

    const result = blogSchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = blogSchema.safeParse({
      description: 'Desc',
      date: '2024-01-01',
      tags: ['tech'],
      readTime: '3 min',
      lang: 'es',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = blogSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects invalid lang values', () => {
    const result = blogSchema.safeParse({
      title: 'Test',
      description: 'Desc',
      date: '2024-01-01',
      tags: ['tech'],
      readTime: '3 min',
      lang: 'fr',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid date', () => {
    const result = blogSchema.safeParse({
      title: 'Test',
      description: 'Desc',
      date: 'not-a-date',
      tags: ['tech'],
      readTime: '3 min',
      lang: 'es',
    });
    expect(result.success).toBe(false);
  });

  it('coerces string dates to Date objects', () => {
    const result = blogSchema.safeParse({
      title: 'Test',
      description: 'Desc',
      date: '2024-01-01',
      tags: ['tech'],
      readTime: '3 min',
      lang: 'es',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });

  it('validates tags as an array of strings', () => {
    const result = blogSchema.safeParse({
      title: 'Test',
      description: 'Desc',
      date: '2024-01-01',
      tags: 'not-an-array',
      readTime: '3 min',
      lang: 'es',
    });
    expect(result.success).toBe(false);
  });
});
