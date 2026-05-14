import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z.email(),
  source: z.enum(['a', 'b', 'landing']),
  note: z.string().max(500).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
