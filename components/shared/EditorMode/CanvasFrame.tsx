'use client';

import { useEffect, useRef } from 'react';
import { tweaksStore } from './useTweaksStore';
import { DEVICE_WIDTHS, type DeviceKey } from './Toolbar';

type Props = {
  device: DeviceKey;
  path: string;
};

export function CanvasFrame({ device, path }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  const width = DEVICE_WIDTHS[device];

  useEffect(() => {
    return () => tweaksStore.setCanvasDoc(null);
  }, []);

  function handleLoad() {
    tweaksStore.setCanvasDoc(ref.current?.contentDocument ?? null);
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: device === 'desktop' ? 0 : 24,
        background: '#161616',
      }}
    >
      <iframe
        ref={ref}
        key={device}
        src={`${path}?sn-canvas=1`}
        title="canvas"
        onLoad={handleLoad}
        style={{
          width: width === 'fill' ? '100%' : width,
          maxWidth: '100%',
          height: '100%',
          border: device === 'desktop' ? 'none' : '1px solid rgba(233,229,218,0.25)',
          background: '#ffffff',
          display: 'block',
        }}
      />
    </div>
  );
}
