# Startify Design System

## Philosophy

Startify is a minimal, dark-themed new tab page that puts the wallpaper front and center. The UI recedes — it's translucent, blurred, and sparse — so your background image is always the hero. Every element is designed to feel calm, focused, and unobtrusive.

---

## Color Palette

All tokens defined in `src/css/tailwind.css` via Tailwind v4's `@theme` block. The palette is **Dracula-inspired**.

### Core

| Token                    | Value                  | Usage                                   |
| ------------------------ | ---------------------- | --------------------------------------- |
| `--color-default-bg`     | `#282a36`              | Default dark background (Dracula bg)    |
| `--color-dark-bg`        | `hsl(0 0% 6% / 0.925)` | Semi-transparent dark (overlays, menus) |
| `--color-primary-text`   | `#f8f8f2`              | Primary text on dark bg                 |
| `--color-secondary-text` | `#44475a`              | Muted/secondary text                    |
| `--color-transparent`    | `#0006`                | Semi-transparent black                  |

### Accent

| Token                 | Value     | Usage                                             |
| --------------------- | --------- | ------------------------------------------------- |
| `--color-primary`     | `#a3be8c` | Green — positive actions, save buttons            |
| `--color-secondary`   | `#6272a4` | Blue-gray — borders, secondary elements           |
| `--color-surface`     | `#44475a` | Card/surface backgrounds (Dracula current line)   |
| `--color-surface-900` | `#2e303a` | Darker surface (hover states, widget backgrounds) |
| `--color-success`     | `#50fa7b` | Toggle ON state                                   |
| `--color-error`       | `#ff5555` | Toggle OFF state, destructive actions (close)     |
| `--color-warning`     | `#f1fa8c` | Yellow accent                                     |

### Shade Scales

Each semantic color has a 3-stop shade scale (`-50`, `-100`, `-500`, `-900`):

- `primary-50/100/500/900` — green scale
- `secondary-50/100/500/900` — blue-gray scale
- `surface-50/100/500/900` — neutral gray scale
- `error-50/100/500/900` — red scale
- `success-50/100/500/900` — green scale
- `warning-50/100/500/900` — yellow scale

### Quick Link Accent Colors

Defined in `src/constants/colors.ts`:

```ts
predefinedColors = [
  { name: "Green", value: "var(--color-primary-900)" },
  { name: "Gray", value: "var(--color-surface-900)" },
  { name: "Transparent", value: "var(--color-transparent)" },
  { name: "Wallpaper", value: null }
];
```

---

## Typography

### Font Family

- **Primary**: `Inter` — variable font (weight 100–900), self-hosted as WOFF2
- **Fallback**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace** (digital clock): `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ...`

### Font Loading

Defined in `src/css/fonts.css` with two unicode-range subsets:

| Subset    | Size  | Covers                          |
| --------- | ----- | ------------------------------- |
| Latin     | 48 KB | EN, basic Latin-1               |
| Latin-ext | 85 KB | ES, FR, DE, PL (accented chars) |

Total font payload: ~133 KB. Loaded with `font-display: swap`.

### Font Weights Used

| Weight                | Usage                         |
| --------------------- | ----------------------------- |
| `font-medium` (500)   | Labels, dropdown items        |
| `font-semibold` (600) | Section headings, button text |
| `font-bold` (700)     | Quick link titles (uppercase) |

### Type Scale

| Size            | Line Height | Usage                    |
| --------------- | ----------- | ------------------------ |
| `xs` (0.75rem)  | 1           | Small labels             |
| `sm` (0.875rem) | 1.25        | Body text, settings rows |
| `base` (1rem)   | 1.5         | Search input text        |
| `xl` (1.25rem)  | 1.75        | Section titles           |
| `5xl` (3rem)    | 1           | **Digital clock**        |

---

## Spacing & Layout

### Grid System (Dashboard)

The dashboard uses CSS Grid with responsive columns:

```
Mobile:    [70px] [auto] [70px]
Desktop:   [170px] [auto] [170px]
Rows:      [70px] [110px] [auto]
```

- Clock → centered in column 2
- Search → row 2, column 2
- Quick links → row 3, centered
- Settings gear → bottom-left
- Chrome icon → top-left
- Weather widget → top-right

### Quick Link Grid

Responsive auto-fill grid:

| Breakpoint   | Columns |
| ------------ | ------- |
| Default      | 2       |
| `sm` (40rem) | 3       |
| `md` (48rem) | 4       |
| `lg` (64rem) | 6       |

Gap: `1rem` (`gap-4`), padding: `1rem` (`p-4`)

---

## Shapes & Borders

| Token                   | Value    | Usage                            |
| ----------------------- | -------- | -------------------------------- |
| `--radius-rounded-md`   | `8px`    | Cards, buttons, modals, inputs   |
| `--radius-rounded-full` | `9999px` | Search bar (pill), toggle, icons |

### Quick Link Clip Path

Octagonal shape defined in `src/components/quickLink/quickLink.css`:

```css
clip-path: polygon(
  13% 0%,
  87% 0%,
  100% 20%,
  100% 80%,
  87% 100%,
  13% 100%,
  0% 80%,
  0% 20%
);
```

---

## Shadows

| Token                        | Value                                                                  | Usage                                |
| ---------------------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| `--shadow-input`             | `0px 1px 2px 0px rgba(0,0,0,0.1), 0px 0px 0px 1px rgba(50,50,70,0.08)` | Inputs, cards                        |
| `shadow-lg`                  | Tailwind default                                                       | Suggestions dropdown                 |
| `shadow-xl`                  | Tailwind default                                                       | Menu dropdowns                       |
| `0 4px 10px rgba(0,0,0,0.3)` | Inline                                                                 | Quick link background, digital clock |

---

## Components

### Search Bar (`SearchInput.tsx`)

- Pill shape (`rounded-full`)
- White background with subtle shadow
- Scale-up on hover/focus (`hover:scale-105`)
- Search engine favicon on the left
- Arrow button on right with animated chevron (morphs from arrow to arrow on input)
- "Vanish" animation on submit — typed text disintegrates into particles via Canvas

### Digital Clock (`DigitalTime.tsx`)

- Monospace font, `text-5xl`
- `#f8f8f2` text on wallpaper-derived background
- Updates every second

### Quick Link (`QuickLink.tsx`)

- Octagonal clip-path background
- 88px × 144px (standard) or 112px × 166px (big)
- Linear gradient overlay (`rgba(0,0,0,0.2)` → transparent)
- Uppercase bold title
- Hover-revealed "edit dots" menu (Edit / Delete)
- Drag-and-drop reorderable grid
- Add button with animated expanding label on hover

### Toggle (`Toggle.tsx`)

- 24px × 44px pill
- Red (off) → Green (on) with sliding white knob
- Uses CSS-only `peer-checked:` state — no JS animation

### Button (`Button.tsx`)

- Animated moving gradient border
- Border is an SVG rect with a radial gradient dot that travels along the perimeter
- Inner button has `backdrop-blur-xl` glass effect
- Used for Save / Close in modals

### Modals (`Overlay.tsx`)

- Full-screen fixed overlay
- `backdrop-blur-md` glass effect
- Fade in/out with `motion` (0.3s duration)
- Child content scales in (0.8 → 1.0)

### Settings Panel (`Settings.tsx`)

- 550px wide, 500px tall flyout
- Sidebar navigation (Main / Photos / Widgets)
- Section content animates with opacity crossfade
- Opens from the gear icon in bottom-left
- Closes on outside click

### Dropdown (`Dropdown.tsx`)

- Used for search engine picker and widget color picker
- Centered below the trigger with `-translate-x-1/2`
- Arrow icon rotates 180° on open
- Closes on outside click

### Weather Widget (`WeatherSection.tsx`)

- Square aspect ratio widget
- Expands from 64px → 80px on hover
- Shows icon, temperature, and location name
- Context menu for "Detect Location"
- Modal for custom location search

### File Upload (`FileUpload.tsx`)

- Drag-and-drop wallpaper upload
- Animated icon shift on hover (`motion` variants)
- Dashed border placeholder behind the upload box

---

## Animation System

### Libraries

- **Motion** (v12, formerly Framer Motion) — component animations, layout animations, `AnimatePresence`
- **React.useAnimationFrame** — custom `MovingBorder` button animation

### Motion Patterns

| Component            | Type                    | Duration  | Easing           |
| -------------------- | ----------------------- | --------- | ---------------- |
| Overlay              | Opacity                 | 300ms     | default          |
| Modal content        | Scale (0.8→1) + opacity | 300ms     | default          |
| Settings section     | Opacity crossfade       | 300ms     | default          |
| Suggestions dropdown | Height + opacity        | 200–300ms | easeInOut        |
| Quick link title     | Scale (0.1→1) + opacity | 300ms     | default          |
| Search bar           | Scale (1→1.05)          | 200ms     | default          |
| Toggle knob          | Translate X             | —         | CSS transition   |
| Weather widget       | Width (64px→80px)       | 200ms     | CSS transition   |
| Moving border        | SVG rect path traversal | 2000ms    | linear           |
| File upload          | Icon offset + opacity   | spring    | spring (300, 20) |
| Search vanish        | Canvas pixel scatter    | dynamic   | N/A              |

### Constants (`src/constants/time.ts`)

```ts
ANIMATION_STEP = 8; // Vanish animation pixel scan speed
PIXEL_RADIUS_DECAY = 0.05; // Particle shrink rate
SEARCH_DEBOUNCE_MS = 200; // Suggestion debounce
DRAG_THROTTLE_MS = 200; // Drag reorder throttle
MODAL_TRANSITION_DELAY = 300; // Modal enter delay
MODAL_TRANSITION_DURATION = 500;
```

### Canvas Vanish Effect

1. User submits search → canvas renders text at double scale
2. Pixel data extracted from canvas
3. Particles animate with randomized drift (`±1px`) and radius decay (`0.05 * Math.random()`)
4. Scan line sweeps left-to-right at 8px per frame
5. Complete when all particles have decayed

---

## Background / Wallpaper System

- 24 bundled HD photos from Unsplash/Pixabay/500px
- Daily rotation (checks `wallpaperLastChange` timestamp)
- Tracks used wallpapers to avoid repeats until all have been shown
- Custom uploads stored in IndexedDB via Dexie.js
- Wallpaper-derived background color used for widgets and cards
- User can pick a fixed background color (Green, Gray, Transparent, or Wallpaper-based)

---

## Patterns & Conventions

### CSS Utilities

- `cn()` — wraps `clsx` + `tailwind-merge` for conditional classes
- Tailwind v4 utility classes throughout (no CSS modules, no styled-components)
- Global resets in `style.css` (no margin/padding, hidden overflow)

### Data Persistence

- **Settings** → `wxt/storage` (extension storage API)
- **Quick links** → IndexedDB via Dexie
- **Wallpaper state** → `localStorage`
- **Geolocation coordinates** → `localStorage`

### Accessibility

- `sr-only` labels on interactive icons
- `aria-label` on quick link anchors
- Keyboard navigation on suggestions (ArrowUp/ArrowDown/Escape)
- `tabIndex` on interactive elements
- ESC to close modals and dropdowns
- Focus outlines removed (`focus:outline-none`) — intentional for the aesthetic

### i18n

- All user-facing strings via `getMessage()` → WebExtensions i18n
- Supported: EN, ES, FR, DE, PL
- Messages in `public/_locales/{lang}/messages.json`
