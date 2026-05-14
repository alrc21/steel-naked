'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { waitlistSchema, normalizeEmail } from '@/components/shared/waitlist-schema';

type Source = 'a' | 'b' | 'landing';
type Status = 'idle' | 'loading' | 'success' | 'error';

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: EASE }}
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
            <div className="flex items-stretch gap-0 border-b border-[var(--color-paper)]/30">
              <input
                aria-label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBrutalist ? 'YOUR EMAIL' : 'your email'}
                className={`flex-1 bg-transparent px-0 py-3 outline-none placeholder:text-[var(--color-paper)]/40 text-[var(--color-paper)] ${
                  isBrutalist
                    ? 'font-mono uppercase tracking-[0.16em] text-[13px]'
                    : 'font-sans text-[15px]'
                }`}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`px-4 text-[var(--color-paper)] transition-opacity disabled:opacity-50 ${
                  isBrutalist
                    ? 'font-mono uppercase tracking-[0.16em] text-[13px]'
                    : 'font-display italic text-[15px]'
                }`}
              >
                {status === 'loading' ? '…' : submitLabel}
              </button>
            </div>
            {withNote && (
              <textarea
                aria-label="Anything you'd like us to know?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="anything you'd like us to know?"
                maxLength={500}
                rows={2}
                className="bg-transparent border-b border-[var(--color-paper)]/20 py-3 outline-none placeholder:text-[var(--color-paper)]/40 text-[var(--color-paper)] font-sans text-[14px] resize-none"
              />
            )}
            {errorMessage && (
              <motion.p
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: [0, -4, 4, -2, 2, 0] }}
                transition={{ duration: 0.4 }}
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
