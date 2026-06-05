'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { waitlistSchema, normalizeEmail } from '@/components/shared/waitlist-schema';
import { EASE_EDITORIAL, staggerChildren } from '@/lib/motion-presets';

type Source = 'a' | 'b' | 'landing';
type Status = 'idle' | 'loading' | 'success' | 'error';

type WaitlistFormProps = {
  source: Source;
  variant?: 'brutalist' | 'editorial';
  withNote?: boolean;
  submitLabel?: string;
};

const EASE = EASE_EDITORIAL as unknown as [number, number, number, number];

// Success is the page's one true conversion moment — so it gets the page's
// one orchestrated reveal: tag, then a hairline that draws across, then the
// human line. Staggered, never bouncy. Restraint is the brand.
const SUCCESS_ITEM: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const SUCCESS_RULE: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.85, ease: EASE } },
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
            variants={staggerChildren(0.14, 0.05)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.4, ease: EASE } }}
            className="flex flex-col gap-4"
          >
            <motion.div
              variants={SUCCESS_ITEM}
              className="font-mono uppercase tracking-[0.16em] text-[12px] text-[var(--color-accent)]"
            >
              _received.
            </motion.div>
            <motion.div
              aria-hidden
              variants={SUCCESS_RULE}
              style={{ originX: 0 }}
              className="h-px w-full bg-[var(--color-accent)]"
            />
            <motion.p
              variants={SUCCESS_ITEM}
              className="font-sans text-[15px] leading-[1.5] text-[var(--color-paper-2)] max-w-[40ch]"
            >
              You&apos;re on the founder list. We&apos;ll reach out before the launch — previews
              first, always.
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
            data-tweak-id="waitlist-form"
            noValidate
          >
            <div
              className={`flex items-stretch gap-0 border-b transition-colors duration-[600ms] ${
                status === 'error'
                  ? 'border-[var(--color-accent)]'
                  : 'border-[rgba(255,247,212,0.25)] focus-within:border-[var(--color-accent)]'
              }`}
            >
              <input
                aria-label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBrutalist ? 'YOUR EMAIL' : 'your email'}
                className={`flex-1 bg-transparent px-0 py-3 outline-none placeholder:text-[var(--color-paper)]/50 text-[var(--color-paper-2)] ${
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
                className={`px-4 py-2 my-1 rounded-sm bg-[var(--color-accent)] text-[var(--color-ink)] transition-all duration-200 disabled:opacity-50 hover:ring-2 hover:ring-[var(--color-accent)] hover:ring-offset-2 hover:ring-offset-[var(--color-dark)] active:translate-y-px active:duration-75 ${
                  isBrutalist
                    ? 'font-mono uppercase tracking-[0.16em] text-[13px]'
                    : 'font-sans text-[15px] font-medium'
                }`}
                data-tweak-id="waitlist-cta"
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
                  className="bg-transparent border-b border-[rgba(255,247,212,0.15)] focus:border-[var(--color-accent)] transition-colors duration-[600ms] py-3 outline-none placeholder:text-[var(--color-paper)]/50 text-[var(--color-paper-2)] font-sans text-[14px] resize-none"
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
            <p className="font-mono uppercase tracking-[0.12em] text-[10px] text-[var(--color-steel)]/60 mt-2">
              No spam. Only launch updates, previews and founder access.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
