'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type CursorProps = {
  variant?: 'brutalist' | 'editorial';
};

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeHover(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getHoverSnapshot() {
  return window.matchMedia(HOVER_QUERY).matches;
}

function getHoverServerSnapshot() {
  return false;
}

export function Cursor({ variant = 'editorial' }: CursorProps) {
  const enabled = useSyncExternalStore(subscribeHover, getHoverSnapshot, getHoverServerSnapshot);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const sy = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function onOver(e: MouseEvent) {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest('a, button, input, textarea, [data-cursor-hover]'));
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const baseSize = variant === 'brutalist' ? 6 : 4;
  const hoverSize = variant === 'brutalist' ? 28 : 36;
  const blendMode = variant === 'brutalist' ? 'difference' : 'normal';

  return (
    <motion.div
      aria-hidden
      style={{
        left: sx,
        top: sy,
        mixBlendMode: blendMode,
      }}
      animate={{
        width: hovering ? hoverSize : baseSize,
        height: hovering ? hoverSize : baseSize,
      }}
      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] }}
      className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ink)]"
    />
  );
}
