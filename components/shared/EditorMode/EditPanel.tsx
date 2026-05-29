'use client';

import { useState } from 'react';
import { tweaksStore, useTweaksStore } from './useTweaksStore';
import { TypographyTab } from './tabs/TypographyTab';
import { SpacingTab } from './tabs/SpacingTab';
import { LayoutTab } from './tabs/LayoutTab';
import { ColorTab } from './tabs/ColorTab';

type TabKey = 'typography' | 'spacing' | 'layout' | 'color';

const TABS: ReadonlyArray<{ key: TabKey; label: string }> = [
  { key: 'typography', label: 'Type' },
  { key: 'spacing', label: 'Space' },
  { key: 'layout', label: 'Layout' },
  { key: 'color', label: 'Color' },
];

const PANEL_BG = 'rgba(14,14,14,0.95)';
const PANEL_FG = '#FFF7D4';
const ACCENT = '#BBFF00';
const FONT = 'var(--font-mono), ui-monospace, monospace';

export function EditPanel() {
  const { editorMode, selectedId, tweaks } = useTweaksStore();
  const [tab, setTab] = useState<TabKey>('typography');
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!editorMode) return null;

  const tweak = selectedId ? (tweaks[selectedId] ?? {}) : {};

  async function onSave() {
    const res = await tweaksStore.save();
    if (res.ok) {
      setToast({ kind: 'ok', msg: 'saved' });
    } else {
      setToast({ kind: 'err', msg: `error: ${res.error ?? 'unknown'}` });
    }
    setTimeout(() => setToast(null), 2000);
  }

  function onResetElement() {
    if (selectedId) tweaksStore.resetElement(selectedId);
  }

  function onResetAll() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    tweaksStore.resetAll();
    setConfirmReset(false);
  }

  return (
    <div
      data-sn-editor-panel=""
      role="dialog"
      aria-label="Editor panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 320,
        height: '100vh',
        background: PANEL_BG,
        color: PANEL_FG,
        fontFamily: FONT,
        fontSize: 11,
        letterSpacing: '0.04em',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid rgba(233,229,218,0.12)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(233,229,218,0.12)',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          _editor / {selectedId ?? '—'}
        </span>
        <button
          type="button"
          aria-label="Close editor"
          onClick={() => tweaksStore.setEditorMode(false)}
          style={{
            background: 'transparent',
            color: PANEL_FG,
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
            fontSize: 11,
            letterSpacing: '0.04em',
          }}
        >
          [ × ]
        </button>
      </div>

      {!selectedId ? (
        <div
          style={{
            padding: 24,
            opacity: 0.6,
            textTransform: 'uppercase',
            fontSize: 10,
            letterSpacing: '0.06em',
            lineHeight: 1.6,
          }}
        >
          click an element to edit
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              gap: 0,
              borderBottom: '1px solid rgba(233,229,218,0.12)',
            }}
          >
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  style={{
                    flex: 1,
                    background: active ? ACCENT : 'transparent',
                    color: active ? '#0E0E0E' : PANEL_FG,
                    border: '1px solid rgba(233,229,218,0.2)',
                    borderRight: 'none',
                    padding: '5px 4px',
                    fontFamily: 'inherit',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: 0,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
            }}
          >
            {tab === 'typography' && <TypographyTab id={selectedId} tweak={tweak} />}
            {tab === 'spacing' && <SpacingTab id={selectedId} tweak={tweak} />}
            {tab === 'layout' && <LayoutTab id={selectedId} tweak={tweak} />}
            {tab === 'color' && <ColorTab id={selectedId} tweak={tweak} />}
          </div>
        </>
      )}

      <div
        style={{
          padding: 12,
          borderTop: '1px solid rgba(233,229,218,0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {toast && (
          <div
            style={{
              padding: '4px 8px',
              background: toast.kind === 'ok' ? 'rgba(187,255,0,0.15)' : 'rgba(255,80,80,0.15)',
              color: toast.kind === 'ok' ? ACCENT : '#ff8080',
              fontSize: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {toast.msg}
          </div>
        )}
        <button
          type="button"
          onClick={onSave}
          style={{
            background: ACCENT,
            color: '#0E0E0E',
            border: 'none',
            padding: '6px 10px',
            fontFamily: 'inherit',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 0,
            textAlign: 'left',
          }}
        >
          [ save &rarr; json ]
        </button>
        <button
          type="button"
          onClick={onResetElement}
          disabled={!selectedId}
          style={{
            background: 'transparent',
            color: PANEL_FG,
            border: '1px solid rgba(233,229,218,0.2)',
            padding: '6px 10px',
            fontFamily: 'inherit',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: selectedId ? 'pointer' : 'not-allowed',
            opacity: selectedId ? 1 : 0.4,
            borderRadius: 0,
            textAlign: 'left',
          }}
        >
          [ reset element ]
        </button>
        <button
          type="button"
          onClick={onResetAll}
          style={{
            background: 'transparent',
            color: confirmReset ? '#ff8080' : PANEL_FG,
            border: `1px solid ${confirmReset ? '#ff8080' : 'rgba(233,229,218,0.2)'}`,
            padding: '6px 10px',
            fontFamily: 'inherit',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 0,
            textAlign: 'left',
          }}
        >
          {confirmReset ? '[ click again to confirm ]' : '[ reset all ]'}
        </button>
      </div>
    </div>
  );
}
