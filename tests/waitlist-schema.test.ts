import { describe, expect, it } from 'vitest';
import { waitlistSchema, normalizeEmail } from '@/components/shared/waitlist-schema';

describe('waitlistSchema', () => {
  it('accepts a valid email and source a', () => {
    const result = waitlistSchema.safeParse({ email: 'a@b.co', source: 'a' });
    expect(result.success).toBe(true);
  });

  it('accepts a valid email with optional note', () => {
    const result = waitlistSchema.safeParse({
      email: 'a@b.co',
      source: 'b',
      note: 'Interested in commissioning a custom piece.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = waitlistSchema.safeParse({ email: 'not-an-email', source: 'a' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown source', () => {
    const result = waitlistSchema.safeParse({ email: 'a@b.co', source: 'c' });
    expect(result.success).toBe(false);
  });

  it('rejects a note longer than 500 chars', () => {
    const result = waitlistSchema.safeParse({
      email: 'a@b.co',
      source: 'a',
      note: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe('normalizeEmail', () => {
  it('lowercases and trims', () => {
    expect(normalizeEmail('  A@B.CO  ')).toBe('a@b.co');
  });
});
