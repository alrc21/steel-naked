'use client';

import { useEffect } from 'react';

/**
 * A single, tasteful brand signature printed once to the console — a small
 * reward for the curious who open dev tools. Renders nothing to the page.
 */
export function BrandSignature() {
  useEffect(() => {
    console.log(
      '%cSteel Naked™%c\nfolded from one continuous sheet of stainless steel.\nnear-future. brutally permanent. — valencia, spain.',
      'font-family:monospace;font-weight:700;font-size:13px;color:#BBFF00;letter-spacing:0.06em;',
      'font-family:monospace;font-size:11px;color:#8a8a8a;letter-spacing:0.04em;'
    );
  }, []);

  return null;
}
