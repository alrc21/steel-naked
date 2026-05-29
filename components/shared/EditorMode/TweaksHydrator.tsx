import { loadTweaks } from '@/lib/tweaks/load-tweaks';
import { tweaksToStyleBlock } from '@/lib/tweaks/tweak-to-css';

export async function TweaksHydrator() {
  const tweaks = await loadTweaks();
  const css = tweaksToStyleBlock(tweaks);
  const bootstrap = `window.__SN_TWEAKS__ = ${JSON.stringify(tweaks)};`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
    </>
  );
}
