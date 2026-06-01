# Steel Naked — Sistemas de Edición Visual

> Estado al 2026-06-01. Commit de referencia: `0f70021`.

Este documento describe los dos sistemas de tweak/edición construidos sobre la página: **TweakPanel** (fuentes globales) y **Editor Mode** (edición visual por elemento). Ambos viven en el repo, ambos commitean al git, ambos respetan la filosofía files-as-source-of-truth.

---

## 1. TweakPanel — swap global de fuentes

**Activar**: `Shift + T` (o `?` si tu teclado lo emite directo).
**Ubicación visible**: esquina inferior derecha.
**Persistencia**: `localStorage` (solo en tu navegador).

### Qué permite

- Cambiar la familia tipográfica de los tres slots globales:
  - **Display** → controla todos los `.font-display` (headlines)
  - **Body** → controla `.font-sans` (texto base)
  - **Mono** → controla `.font-mono` (captions, labels, corner text)
- Cambiar el peso default de Graphik Wide (Thin 100 → Black 900, sin italics)
- Preview en vivo "Steel Naked" dentro del panel

### Fuentes disponibles (locales al proyecto)

| Slot | Opciones |
|---|---|
| `graphik-wide` | 8 pesos (100, 200, 300, 400, 500, 600, 700, 900) |
| `space-grotesk` | 5 pesos (300, 400, 500, 600, 700) |
| `space-mono` | 2 pesos (400, 700) |

Las tres fuentes están cargadas vía `next/font/local` en `lib/fonts.ts` desde `public/fonts/`.

### Mecánica interna (resuelve el bug del 2026-05-28)

El primer intento usaba `--font-display: var(--font-sans)` — cadena circular de CSS variables que fallaba al resolverse con los nombres con hash que genera next/font.

**Solución actual**: capturar al mount los **valores reales** de `--font-display`, `--font-sans`, `--font-mono` desde `getComputedStyle(document.documentElement)`, y aplicar esos strings literales (no `var(...)` chains). Eso rompe el ciclo y garantiza que el swap funcione.

### Archivos clave

- `components/shared/TweakPanel.tsx` — UI + lógica
- `app/globals.css` — declaración `.font-display { font-family: var(--font-display); font-weight: var(--font-display-weight, 300); }`

---

## 2. Editor Mode — edición visual por elemento

**Activar**: `Shift + E`.
**Ubicación visible**: panel slide-in desde la derecha (320px).
**Persistencia**: `content/tweaks.json` en disco (vía endpoint `/api/save`).

### Qué permite

Modo edición sobre la página en vivo:

1. Pulsa `Shift+E` → entras en modo editor
2. Mueve el mouse → cualquier elemento con `data-tweak-id` se outline en lima (hover)
3. Click → selecciona el elemento, el panel derecho muestra controles
4. **4 tabs**:
   - **Typography**: fontFamily, fontSize, fontWeight (100–900), letter-spacing, line-height
   - **Spacing**: marginTop/Bottom, paddingTop/Bottom (sliders 0–240px)
   - **Layout**: text-align (left/center/right)
   - **Color**: 10 chips de la paleta del proyecto
5. Cambios aplicados en vivo (inline styles sobre el elemento real)
6. Botones del panel:
   - `[ save → json ]` — POST a `/api/save`, escribe `content/tweaks.json`
   - `[ reset element ]` — limpia tweaks del elemento seleccionado
   - `[ reset all ]` — limpia todos (con confirm)
- `ESC` deselecciona. `Shift+E` cierra el modo editor.

### Elementos editables (25 marcados)

| Sección | IDs disponibles |
|---|---|
| Topbar | `topbar-nav`, `topbar-locale` |
| Hero | `hero-image` |
| About | `about-section`, `about-label`, `about-eyebrow`, `about-headline`, `about-image`, `about-caption-1`, `about-caption-2`, `about-indicator` |
| Concept | `concept-section`, `concept-eyebrow`, `concept-headline`, `concept-caption` |
| Brutally Permanent | `bp-preview-label`, `bp-step-counter`, `bp-headline`, `bp-caption` |
| Waitlist | `waitlist-section`, `waitlist-headline`, `waitlist-form`, `waitlist-cta` |
| Footer | `footer-section`, `footer-tagline`, `footer-links` |

Para agregar un elemento nuevo: agrega `data-tweak-id="X"` al JSX y `X` al array `TWEAKABLE_IDS` en `lib/tweaks/types.ts`.

### Flujo profesional (file-as-source-of-truth)

```
1. pnpm dev en local
2. Shift+E → modo editor
3. Click elemento → tweak con sliders
4. Preview en vivo (inline styles)
5. [ save → json ]  →  content/tweaks.json se actualiza en disco
6. git add content/tweaks.json
7. git commit + git push
8. Vercel rebuild
9. TweaksHydrator (server component) lee tweaks.json
10. Genera <style> con rules tipo:
     [data-tweak-id="bp-headline"] {
       font-size: 84px !important;
       letter-spacing: -0.015em !important;
     }
11. Producción muestra el diseño exacto
```

### Importante

- `/api/save` **solo funciona en `pnpm dev`**. En producción Vercel responde **403** porque el filesystem es read-only. Esto es intencional.
- El editor sigue funcionando visualmente en producción (puedes activarlo con Shift+E para previsualizar), pero `[ save ]` no persiste — solo localStorage.
- Los tweaks aplicados llevan `!important` en cada propiedad — eso garantiza que ganen sobre cualquier inline style de los componentes fuente.

### Archivos clave

```
lib/tweaks/
├── types.ts              ← Tweak, TweaksData, TWEAKABLE_IDS, COLOR_TOKENS
├── load-tweaks.ts        ← server-only reader de content/tweaks.json
└── tweak-to-css.ts       ← pure fn tweaks → CSS string con !important

content/
└── tweaks.json           ← fuente de verdad commiteable

app/api/save/
└── route.ts              ← POST handler, escribe JSON, 403 en prod

components/shared/EditorMode/
├── EditorRoot.tsx        ← top-level mount, keyboard listener Shift+E
├── useTweaksStore.ts     ← store custom (sin Zustand)
├── ElementOverlay.tsx    ← paint outlines hover/select
├── EditPanel.tsx         ← slide-in panel derecho
├── TweaksHydrator.tsx    ← server component, inyecta <style> + window.__SN_TWEAKS__
├── tabs/
│   ├── TypographyTab.tsx
│   ├── SpacingTab.tsx
│   ├── LayoutTab.tsx
│   └── ColorTab.tsx
└── controls/
    ├── Slider.tsx
    ├── Segmented.tsx
    └── Chip.tsx
```

Montaje en `app/layout.tsx`: `<TweaksHydrator />` antes del contenido (CSS first), `<EditorRoot />` al final.

---

## 3. Estado actual del diseño (2026-06-01)

### Tipografía

- **Display default**: Graphik Wide Light (300) en Hero, About, Concept
- **Excepción**: "Brutally permanent" usa Bold (700) lime — intencional
- **Topbar nav**: Graphik Wide Light 14px non-uppercase, em-dashes a 45% opacidad
- **Captions**: Space Mono 10–11px uppercase (BrutallyPermanent caption a 10px tras ajuste del 2026-05-28)

### Paleta

```css
--color-paper:    #E6E6E6   /* main gray bg light sections */
--color-paper-2:  #FFF7D4   /* cream warm — alt light bg */
--color-ink:      #141414   /* near-black headlines/body */
--color-ink-2:    #4D4D4D   /* graphite secondary */
--color-mute:     #4D4D4D
--color-steel:    #CCCCCC   /* hairlines */
--color-dark:     #4D4D4D   /* waitlist/footer bg */
--color-stone:    #125B59   /* deep teal accent reservado */
--color-accent:   #BBFF00   /* lime — Brutally permanent + CTAs */
--color-accent-2: #2B1A5B   /* deep indigo reservado */
```

### Secciones activas

`Topbar → Hero → About → BrutallyPermanent → Concept → WaitlistB → FooterB`

Comentados por ahora: `ThreeStudies`, `Materiality`, `Experience`, `Philosophy`.

### Animación scroll-pin (Brutally permanent)

- Wrapper 400vh, sticky inner 100vh
- 4 steps con curtain-rise (bg + portrait + caption + labels)
- `useSpring` (stiffness 90, damping 22) suaviza scrollYProgress
- Dead-zone 8%/92% en boundaries para evitar flicker
- Headline tope `clamp(40px, 5.5vw, 96px)` tras ajuste del 2026-05-28

---

## 4. Decisiones de diseño tomadas en esta sesión

1. **Light 300 como peso default de display** — el mockup del cliente Ergest se ve mucho más fino que Semibold 600. Aplicado a Hero/About/Concept; Brutally permanent se queda en 700 como excepción.
2. **Topbar nav en Graphik Wide Light non-uppercase** — el mockup mostraba `Concept — Object — Philosophy — Contact` con em-dashes a 45% opacidad, no Space Mono uppercase como teníamos.
3. **Captions de About y Concept anchored bottom-right** — no mid-center como antes; matchea la composición editorial del mockup.
4. **Brutally permanent headline más chico** — bajado de `clamp(64px, 10vw, 180px)` a `clamp(40px, 5.5vw, 96px)` tras notar que era casi 2x más grande que el mockup.
5. **Editor visual custom (no Plasmic/Tina/Sanity)** — research confirmó que un CMS es overkill para una single-page editorial; extender el TweakPanel custom encaja mejor con la filosofía Medusa Quantum (git como source of truth, sin cloud DB lock-in).

---

## 5. Pendiente / abierto

- **Font del cliente no identificada**. Sospecha: PP Editorial New o Söhne Breit (comerciales, no en el proyecto). Acción próxima: pedir a Ergest el archivo `.otf` o nombre exacto.
- **Marcar más elementos** si la edición visual se queda corta (actualmente 25; agregar nuevos es 2 líneas).
- **Header redesign estructural** — solo se hicieron ajustes de color/tipografía; redesign mayor pendiente si el cliente lo pide.
- **Reactivar secciones comentadas** (ThreeStudies, Materiality, Experience, Philosophy) cuando llegue el contenido final.

---

## 6. Commits clave de la sesión

```
0f70021 feat(editor-mode): visual on-page editor con Shift+E
e13a9f0 fix(brutally-permanent): reducir tamaño headline + caption para matchear mockup
aef0bd3 fix(tweak-panel): font swap funciona + preview visible
36875ea fix(tweak-panel): atajo Shift+T además de ? (mejor compat con teclado ES)
5eadc60 feat(typography,scroll): Graphik Wide Light por default + Topbar nav refinado + smoother Brutally permanent
4375df2 fix(about,concept): eyebrow inline with headline + vertical center per mockup
```

---

## 7. Cómo retomar la próxima sesión

1. `cd "01-diseño-creativo/Steel Naked/steel-naked"`
2. `pnpm dev` → http://localhost:3000
3. Abrir consola (Cmd+Opt+I) — verás hints de Shift+T y Shift+E en lima
4. Para tipografía global: `Shift+T`
5. Para edición fina por elemento: `Shift+E`
6. Editar → `[ save → json ]` → `git add content/tweaks.json && git commit + git push`
