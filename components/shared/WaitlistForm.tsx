'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { waitlistSchema, normalizeEmail } from '@/components/shared/waitlist-schema';
import { EASE_EDITORIAL } from '@/lib/motion-presets';

type Source = 'a' | 'b' | 'landing';
type Status = 'idle' | 'loading' | 'success' | 'error';

type WaitlistFormProps = {
  source: Source;
  variant?: 'brutalist' | 'editorial';
  withNote?: boolean;
  submitLabel?: string;
};

export function WaitlistForm({
  source,
  variant = 'editorial',
  withNote = false,
  submitLabel = 'Join the founder list →',
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    const parsed = waitlistSchema.safeParse({
      email: normalizeEmail(email),
      source,
      note: note.trim() || undefined,
    });
    if (!parsed.success) {
      setStatus('error');
      setErrorMessage('Please enter a valid email.');
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 700));
    console.info('[stub] waitlist submit:', parsed.data);
    setStatus('success');
  }

  const isBrutalist = variant === 'brutalist';

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
            className={`font-mono uppercase tracking-[0.16em] text-[12px] ${isBrutalist ? 'text-[var(--color-paper)]' : 'text-[var(--color-paper)]'}`}
          >
            _received. you are on the list.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
            noValidate
          >
            <div
              className={`flex items-stretch gap-0 border-b transition-colors duration-[600ms] ${
                status === 'error'
                  ? 'border-[var(--color-accent)]'
                  : 'border-[var(--color-paper)]/30'
              }`}
            >
              <input
                aria-label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBrutalist ? 'YOUR EMAIL' : 'your email'}
                className={`flex-1 bg-transparent px-0 py-3 outline-none placeholder:text-[var(--color-paper)]/60 text-[var(--color-paper)] ${
                  isBrutalist
                    ? 'font-mono uppercase tracking-[0.16em] text-[13px]'
                    : 'font-sans text-[15px]'
                }`}
              />
              <button
                type="submit"
                aria-label="Join the founder list"
                aria-busy={status === 'loading'}
                disabled={status === 'loading'}
                className={`px-4 text-[var(--color-paper)] transition-opacity disabled:opacity-50 ${
                  isBrutalist
                    ? 'font-mono uppercase tracking-[0.16em] text-[13px]'
                    : 'font-sans text-[15px] font-medium'
                }`}
              >
                {status === 'loading' ? '…' : submitLabel}
              </button>
            </div>
            {withNote && (
              <>
                <label htmlFor="waitlist-note" className="sr-only">
                  Anything you&apos;d like us to know?
                </label>
                <textarea
                  id="waitlist-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="anything you'd like us to know?"
                  maxLength={500}
                  rows={2}
                  className="bg-transparent border-b border-[var(--color-paper)]/20 py-3 outline-none placeholder:text-[var(--color-paper)]/60 text-[var(--color-paper)] font-sans text-[14px] resize-none"
                />
              </>
            )}
            {errorMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="font-mono uppercase tracking-[0.12em] text-[11px] text-[var(--color-accent)]"
              >
                {errorMessage}
              </motion.p>
            )}
            <p className="font-mono uppercase tracking-[0.12em] text-[10px] text-[var(--color-paper)]/50 mt-2">
              No spam. Only launch updates, previews and founder access.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
