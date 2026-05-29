'use client';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label?: string;
  value: T | undefined;
  options: ReadonlyArray<Option<T>>;
  onChange: (v: T) => void;
};

export function Segmented<T extends string>({ label, value, options, onChange }: Props<T>) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <div
          style={{
            marginBottom: 4,
            textTransform: 'uppercase',
            opacity: 0.7,
            fontSize: 10,
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: 0,
          border: '1px solid rgba(233,229,218,0.2)',
        }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                background: active ? '#BBFF00' : 'transparent',
                color: active ? '#0E0E0E' : '#FFF7D4',
                border: 'none',
                padding: '6px 4px',
                fontFamily: 'inherit',
                fontSize: 10,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
