import { z } from 'zod';

// No JIT: zod otherwise probes `Function('')`, which a CSP without
// 'unsafe-eval' reports (and blocks once enforced).
z.config({ jitless: true });

export const waitlistSchema = z.object({
  email: z.email(),
  source: z.enum(['a', 'b', 'landing']),
  note: z.string().max(500).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
