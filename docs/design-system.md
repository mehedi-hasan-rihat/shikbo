# Shikbo — Design System

Every visual decision must answer one question:
**"Does this improve information hierarchy or usability?"**
If not, remove it.

---

## Design Language

The interface is a serious internal tool — engineered, confident, and precise.
It should feel like software built by people who care about craft,
not a generic SaaS template or an AI-generated dashboard.

References in spirit (not to copy): Linear, Vercel dashboard, GitHub, Basecamp.

**Do not use:**
- Gradients or glassmorphism
- Decorative shadows or floating-card aesthetics
- Neon, saturated, or pastel fill colors
- Large border radii (no `8px+` on structural components)
- Oversized or pill-shaped buttons and cards
- Decorative illustrations or large icon treatments
- Excessive animation or spring/bounce effects
- "AI product" visual clichés: glowing rings, purple-to-blue gradients, dark mode by default
- Generic hero sections with blurred shapes

The base is a cool gray page surface with white raised panels.
Brand color is deep charcoal — not blue.

---

## Color Tokens

All colors via CSS custom properties. No hardcoded hex values in components.

### Surfaces

```css
--page-surface:  #F4F4F5;   /* app/page background — cool gray */
--panel:         #FFFFFF;   /* raised cards, modals, menus */
--soft-panel:    #FAFAFA;   /* subtle fills inside framed columns */
```

### Background (legacy aliases, map to surface tokens)

```css
--background:        #F4F4F5;
--background-subtle: #FAFAFA;
--background-muted:  #F4F4F5;
--background-hover:  #EFEFEF;
--background-active: #E9E9EB;
```

### Border

```css
--border:        #E4E4E7;
--border-subtle: #F2F2F2;
--border-strong: #D4D4D8;
```

### Brand

```css
--brand:       #232323;   /* primary actions, key emphasis */
--brand-hover: #18181B;
--brand-fg:    #FFFFFF;
```

### Text

```css
--text-primary:   #18181B;   /* headings, high-contrast labels */
--text-secondary: #52525B;   /* body, descriptions */
--text-muted:     #71717A;   /* placeholders, supporting copy */
--text-disabled:  #A1A1AA;
--text-inverse:   #FFFFFF;
```

### Semantic — Success

```css
--success:            #16A34A;
--success-subtle:     #F0FDF4;
--success-border:     #BBF7D0;
--success-foreground: #166534;
```

### Semantic — Warning

```css
--warning:            #D97706;
--warning-subtle:     #FFFBEB;
--warning-border:     #FDE68A;
--warning-foreground: #92400E;
```

### Semantic — Danger

```css
--danger:            #DC2626;
--danger-subtle:     #FEF2F2;
--danger-border:     #FECACA;
--danger-foreground: #991B1B;
```

### Semantic — Info

```css
--info:            #2563EB;
--info-subtle:     #EFF6FF;
--info-border:     #BFDBFE;
--info-foreground: #1E40AF;
```

---

## Semantic Tokens — Assignment Difficulty

Difficulty is state, not decoration. Do not use saturated colors.

```css
--difficulty-beginner:        #16A34A;
--difficulty-beginner-bg:     #F0FDF4;

--difficulty-intermediate:    #2563EB;
--difficulty-intermediate-bg: #EFF6FF;

--difficulty-advanced:        #D97706;
--difficulty-advanced-bg:     #FFFBEB;
```

---

## Semantic Tokens — Submission Status

```css
--status-pending:              #71717A;
--status-pending-bg:           #F4F4F5;

--status-accepted:             #16A34A;
--status-accepted-bg:          #F0FDF4;

--status-needs-improvement:    #D97706;
--status-needs-improvement-bg: #FFFBEB;
```

---

## Typography

Three font roles — never mix them up.

| Role | Font | Usage |
|------|------|-------|
| UI | Inter | Body, labels, controls, nav |
| Mono | Geist Mono | Table headers, badge text, KPI labels, eyebrows |
| Display | EB Garamond | Page titles, dialog titles, editorial headings |

```css
--font-ui:      "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono:    "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
--font-display: "EB Garamond", "Adobe Jenson Pro", Georgia, serif;
```

### Size Tokens

```css
--font-xs:   11px;
--font-sm:   13px;
--font-base: 14px;
--font-md:   15px;
--font-lg:   16px;
--font-xl:   20px;
--font-2xl:  24px;
--font-3xl:  30px;
```

### Weight Tokens

```css
--font-regular:  400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### Rules

- Body text: 14px Inter
- Table headers: 11px Geist Mono, uppercase, `letter-spacing: 0.06em`
- KPI labels: 11px Geist Mono, uppercase
- Badge text: Geist Mono, uppercase
- Sidebar section labels: Geist Mono, uppercase
- Page titles: 24px EB Garamond, `letter-spacing: -0.02em`
- Dialog titles: 16px EB Garamond
- Minimum body copy: 16px in reading-context prose

---

## Spacing

Base unit: 4px. All spacing from this scale only.

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

Common UI spacing: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`.
Do not use arbitrary values.

---

## Border Radius

**4px everywhere. This is the system's visual signature.**

```css
--radius:      4px;   /* all structural components */
--radius-sm:   4px;
--radius-md:   4px;
--radius-lg:   4px;
--radius-xl:   4px;
--radius-full: 9999px;  /* toggles, avatars, radios, range thumbs only */
```

Exceptions — full round (`9999px`) is only for:
- Toggle switches
- Avatar circles
- Radio buttons
- Range thumb handles

Do not use `6px`, `8px`, `10px`, or higher on buttons, cards, badges, inputs, modals, tabs, or tables.

---

## Borders and Shadows

Depth comes from **white panels on a gray page surface** plus `1px` borders.
Shadows are for genuine elevation only — not decoration.

```css
/* Default border */
border: 1px solid var(--border);

/* Shadow tokens */
--shadow-none: none;
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md:   0 4px 12px rgba(0, 0, 0, 0.08);
```

Use `--shadow-md` only for dropdowns and modals. Never on cards.

---

## Layout

### Application Layout

```
Page surface:            var(--page-surface)  — #F4F4F5
Sidebar:                 240px, white panel, right border
Main content:            fluid, white panels on gray background
Max content width:       1400px
Page horizontal padding: 24–32px
Page vertical padding:   28–32px
```

### Responsive Breakpoints

| Context | Behavior |
|---------|---------|
| ≥ 1025px (desktop) | Sidebar visible; `.mobile-nav-wrapper` hidden |
| 769–1024px (tablet) | Sidebar narrows to 200px |
| ≤ 768px (mobile) | Sidebar hidden; `.mobile-nav-wrapper` shown; `.content-area` padding reduced; `.page-header` stacks vertically |

---

## Component Guidelines

### Sidebar

```
background:     var(--panel)
border-right:   1px solid var(--border)
width:          240px
nav item height: 36px
nav item radius: 4px
active state:   var(--background-active) — no colorful highlight
section labels: Geist Mono, uppercase
```

### Cards

Cards are data containers. White panel raised on gray surface.

```
background:  var(--panel)
border:      1px solid var(--border)
radius:      4px
padding:     16–20px
shadow:      none
```

No shadows. No hover glow. No gradient headers. No decorative icons.

### KPI / Metric Cards

```
Label:     Geist Mono, 11px, uppercase, muted
Value:     24px, semibold, letter-spacing: -0.02em
Support:   13px, muted
```

### Tables

```
header font:  Geist Mono, 11px, uppercase, letter-spacing: 0.06em
header bg:    var(--soft-panel)
row separator: 1px solid var(--border-subtle)
row hover:    var(--background-hover)
```

No vertical column borders. Actions compact.

### Buttons

| Variant | Style |
|---------|-------|
| Primary | `var(--brand)` fill, white text |
| Secondary | White panel, `var(--border-strong)` border |
| Ghost | Transparent |
| Danger | `var(--danger)` fill |

```
Height:   36px default / 32px compact / 40px large
Radius:   4px
Font:     Inter, 13px, medium
```

### Inputs and Selects

```
background:   var(--page-surface)  — gray fill at rest
border:       1px solid var(--border)
radius:       4px
height:       36px
focus bg:     var(--panel)         — white on focus
focus border: var(--brand)
focus ring:   0 0 0 3px rgba(35, 35, 35, 0.08)
```

### Badges

```
font:     Geist Mono, 11px, uppercase, letter-spacing: 0.04em
radius:   4px
height:   22px
padding:  0 8px
```

Use semantic fills. No pill shapes.

### Tabs

```
tab bottom indicator: 2px solid var(--brand)
inactive:             var(--text-muted)
active:               var(--text-primary)
```

### Modals / Dialogs

```
background: var(--panel)
border:     1px solid var(--border)
radius:     4px
shadow:     var(--shadow-md)
backdrop:   rgba(0, 0, 0, 0.4)
title font: EB Garamond
```

---

## Charts

Charts are analytical surfaces, not decorations.

- Background: `var(--panel)`
- Grid lines: `var(--border-subtle)`
- Axis labels: `var(--text-muted)`, Geist Mono, uppercase
- Tooltip: white panel, `1px solid var(--border)`, `var(--shadow-sm)`
- Colors: semantic status/difficulty tokens; no rainbow series
- Recharts `fill` props must use resolved hex values (SVG can't consume `var()`)

For `StatusDonutChart` and `StudentProgressChart`, use the exact hex values
from the status tokens above, documented alongside the component.

---

## Animation

State changes only. Not decoration.

```
Duration:   150–200ms
Easing:     ease
Properties: opacity, background-color, border-color, transform
```

No bouncing, spring effects, dramatic page transitions, or large-scale motion.

---

## Reusable Component Library

All shared UI lives in `src/components/ui/`. Always use these before writing custom markup.

| Component | File | Notes |
|-----------|------|-------|
| `Button` | `ui/Button.tsx` | Variants: `primary`, `secondary`, `ghost`, `danger`, `danger-ghost`. Sizes: `sm`, `default`, `lg`. Accepts `loading` prop. |
| `Input` | `ui/Input.tsx` | Wraps `<input>` with label, hint, and error wired via ARIA. |
| `Textarea` | `ui/Textarea.tsx` | Same field pattern as Input. |
| `Select` | `ui/Select.tsx` | Typed `options` array, optional placeholder. |
| `Card` / `KpiCard` | `ui/Card.tsx` | `Card` variants: `default`, `sm`, `kpi`. Use `KpiCard` for metric surfaces. |
| `Badge` / `DifficultyBadge` / `StatusBadge` | `ui/Badge.tsx` | Domain-aware wrappers. Use `DifficultyBadge` and `StatusBadge` for domain values. |
| `Dialog` | `ui/Dialog.tsx` | Accessible modal. Props: `open`, `onClose`, `title`, `description`, `size`, `footer`. Sizes: `sm`, `default`, `lg`, `xl`. |
| `Tabs` | `ui/Tabs.tsx` | Keyboard-navigable tab set. Pass `tabs` array with `id`, `label`, `content`. |
| `Dropdown` | `ui/Dropdown.tsx` | Positioned menu. Props: `trigger`, `groups`, `align`. |
| `EmptyState` | `ui/EmptyState.tsx` | Props: `title`, `description`, `action`. |
| `LoadingState` | `ui/LoadingState.tsx` | Skeleton variants: `list`, `page`, `kpi`. All include `role="status"` and `.sr-only` announcement. |
| `ErrorState` | `ui/ErrorState.tsx` | `role="alert"`. Props: `title`, `message`, `action`. |

Assignment-specific components live in `src/components/assignments/`:

| Component | File | Notes |
|-----------|------|-------|
| `AssignmentForm` | `assignments/AssignmentForm.tsx` | Create/edit form. Props: `action`, `defaultValues`, `submitLabel`. Instructor only. |
| `SubmissionForm` | `assignments/SubmissionForm.tsx` | Student submission form. Fields: URL (required), note (optional). Client component, `useActionState`. |
| `ReviewForm` | `submissions/ReviewForm.tsx` | Instructor review. Fields: status, feedback. Optional `aiContext` prop. Client component, `useActionState`. |
| `StatusDonutChart` | `analytics/StatusDonutChart.tsx` | Recharts donut chart. Props: `data: StatusDistribution`. Hex fill values: accepted `#16a34a`, pending `#71717a`, needs_improvement `#d97706`. |
| `AssignmentImprovePanel` | `assignments/AssignmentImprovePanel.tsx` | "Improve with AI" inline panel. `getFormValues()` callback + `onApply(result)`. Used inside `AssignmentForm`. |
| `FeedbackAssistant` | `submissions/FeedbackAssistant.tsx` | Collapsible AI feedback assistant. `onApply(feedback)` callback. Used inside `ReviewForm`. |
| `AtRiskStudentsTable` | `analytics/AtRiskStudentsTable.tsx` | Students with ≥2 needs_improvement submissions. Client component. |
| `StudentProgressChart` | `analytics/StudentProgressChart.tsx` | Stacked bar + horizontal bar (Recharts). Props: `data: StudentProgressDistribution`. Client component. |

Layout components live in `src/components/layout/`:

| Component | File | Notes |
|-----------|------|-------|
| `AppSidebar` | `layout/AppSidebar.tsx` | Server component. Composes desktop sidebar + mobile drawer. |
| `SidebarNav` | `layout/SidebarNav.tsx` | Client component. Active link via `usePathname`. |
| `UserMenu` | `layout/UserMenu.tsx` | Client dropdown in sidebar footer. Initials avatar + role. |
| `MobileSidebar` | `layout/MobileSidebar.tsx` | Client slide-in drawer. Auto-closes on route change. |

---

## CSS Component Classes

Defined in `src/app/globals.css` under `@layer components`.
Use directly in JSX. Do not rewrite equivalent styles.

### Layout

| Class | Purpose |
|-------|---------|
| `.app-shell` | Root flex wrapper for sidebar + content |
| `.content-area` | Main content region beside sidebar |
| `.page-container` | Standalone page wrapper (max-width + padding) |

### Page Structure

| Class | Purpose |
|-------|---------|
| `.page-header` | Flex row: title left, actions right |
| `.page-title` | 24px EB Garamond, semibold, `letter-spacing: -0.02em` |
| `.page-subtitle` | 14px Inter, muted |

### Cards

| Class | Purpose |
|-------|---------|
| `.card` | Standard card — white panel, `1px border`, `4px` radius, `20px` padding |
| `.card-sm` | Compact — `16px` padding |
| `.card-kpi` | KPI/metric card, flex column |
| `.card-kpi__label` | 11px Geist Mono, uppercase, muted |
| `.card-kpi__value` | 24px, semibold, `letter-spacing: -0.02em` |
| `.card-kpi__support` | 13px, muted |

### Forms

| Class | Purpose |
|-------|---------|
| `.field` | Wraps label + input + hint/error |
| `.field-label` | 13px Inter, medium |
| `.field-hint` | 11px, muted |
| `.field-error` | 11px, danger — add `role="alert"` |
| `.input` | Base text input — gray fill at rest, white on focus |
| `.input--error` | Error state border |
| `.textarea` | Textarea — same focus behavior as `.input` |
| `.select` | Styled `<select>` with chevron |

### Buttons

| Class | Purpose |
|-------|---------|
| `.btn` | Base — all variants extend this |
| `.btn-primary` | Deep charcoal fill |
| `.btn-secondary` | White panel + border |
| `.btn-ghost` | Transparent |
| `.btn-danger` | Red fill |
| `.btn-danger-ghost` | Text-only red |
| `.btn-sm` | 32px height |
| `.btn-lg` | 40px height |

### Badges

| Class | Purpose |
|-------|---------|
| `.badge` | Base — Geist Mono, uppercase, 4px radius |
| `.badge-beginner` / `.badge-intermediate` / `.badge-advanced` | Difficulty |
| `.badge-pending` / `.badge-accepted` / `.badge-needs-improvement` | Status |
| `.badge-neutral` | Generic neutral |

### Tables

| Class | Purpose |
|-------|---------|
| `.table-wrapper` | Horizontal scroll container |
| `.table` | Full-width table — Geist Mono uppercase headers |
| `.td-truncate` | Truncate long text in a cell with ellipsis |
| `.td-wrap` | Allow a cell to wrap normally |

### Tabs

| Class | Purpose |
|-------|---------|
| `.tabs-list` | Standard tab row with bottom border |
| `.tabs-list-scroll` | Horizontally scrollable tab row — hides scrollbar cross-browser; use on mobile-friendly filter bars |

### Sidebar

| Class | Purpose |
|-------|---------|
| `.sidebar` | Fixed 240px panel — hidden mobile |
| `.sidebar-nav` | Flex column of nav items |
| `.sidebar-nav-item` | Nav link/button — add `.active` or `aria-current="page"` |
| `.sidebar-section-label` | 11px Geist Mono, uppercase eyebrow |

### State Surfaces

| Class | Purpose |
|-------|---------|
| `.callout` | Base inline callout |
| `.callout-success` / `.callout-warning` / `.callout-danger` / `.callout-info` | Semantic variants |
| `.empty-state` | Centered empty state container |
| `.empty-state__title` | 14px, medium |
| `.empty-state__description` | 13px, muted, max 320px |
| `.skeleton` | Pulsing placeholder |
| `.sr-only` | Visually hidden, screen-reader accessible |
| `.skip-link` | Skip-to-content — hidden until `:focus-visible` |

### Overlays

| Class | Purpose |
|-------|---------|
| `.dialog-backdrop` | Fixed full-screen backdrop |
| `.dialog` | Modal — default max 480px, 4px radius |
| `.dialog-sm` / `.dialog-lg` / `.dialog-xl` | Size variants |
| `.dialog-header` / `.dialog-body` / `.dialog-footer` | Dialog sections |
| `.dialog-title` | EB Garamond title |
| `.dialog-description` | 13px, muted |
| `.dropdown-menu` | Positioned menu surface |
| `.dropdown-item` | Menu item |
| `.dropdown-item-danger` | Danger-tinted item |
| `.dropdown-separator` | Horizontal rule between groups |

### Tabs

| Class | Purpose |
|-------|---------|
| `.tabs` | Wrapper |
| `.tabs-list` | Tab button row — border-bottom |
| `.tabs-trigger` | Tab button — add `.active` or `aria-selected="true"` |
| `.tabs-panel` | Tab content |

### Responsive Utilities

| Class | Behavior |
|-------|---------|
| `.mobile-nav-wrapper` | Hidden on desktop; shown mobile |
| `.grid-cols-responsive` | Collapses to 1-column below 768px |
| `.dash-grid-sidebar-right` | `1fr 320px` desktop → `1fr 280px` tablet → `1fr` mobile |
| `.dash-grid-sidebar-left` | `320px 1fr` desktop → `280px 1fr` tablet → `1fr` mobile |
| `.dash-grid-sidebar-right-md` | `1fr 340px` desktop → `1fr 280px` tablet → `1fr` mobile |
| `.kpi-grid` | `auto-fill minmax(160px)` desktop → `auto-fill minmax(140px)` tablet → `repeat(2,1fr)` mobile |

---

## Implementation Rules

1. All color, spacing, typography, radius, and shadow values come from tokens.
2. Do not hardcode hex values, pixel values, or arbitrary numbers in components.
3. Tokens are CSS custom properties on `:root`. Tailwind maps to them.
4. Use components from `src/components/ui/` before writing custom markup.
5. Adding a component to `src/components/ui/`? Document it in this file.
6. Adding a CSS class to `globals.css`? Add it to the class tables above.
7. Recharts SVG `fill` props cannot consume `var()` — document the resolved hex values alongside the chart component.

---

## CSS Custom Properties — Full Reference

```css
:root {
  /* Surfaces */
  --page-surface:  #F4F4F5;
  --panel:         #FFFFFF;
  --soft-panel:    #FAFAFA;

  /* Background (legacy aliases) */
  --background:        #F4F4F5;
  --background-subtle: #FAFAFA;
  --background-muted:  #F4F4F5;
  --background-hover:  #EFEFEF;
  --background-active: #E9E9EB;
  --surface:           #FFFFFF;
  --surface-subtle:    #FAFAFA;
  --surface-hover:     #F4F4F5;

  /* Border */
  --border:        #E4E4E7;
  --border-subtle: #F2F2F2;
  --border-strong: #D4D4D8;

  /* Brand */
  --brand:       #232323;
  --brand-hover: #18181B;
  --brand-fg:    #FFFFFF;

  /* Primary (legacy aliases) */
  --primary:            #232323;
  --primary-hover:      #18181B;
  --primary-active:     #09090B;
  --primary-subtle:     #F4F4F5;
  --primary-foreground: #FFFFFF;

  /* Text */
  --text-primary:   #18181B;
  --text-secondary: #52525B;
  --text-muted:     #71717A;
  --text-disabled:  #A1A1AA;
  --text-inverse:   #FFFFFF;

  /* Success */
  --success:            #16A34A;
  --success-subtle:     #F0FDF4;
  --success-border:     #BBF7D0;
  --success-foreground: #166534;

  /* Warning */
  --warning:            #D97706;
  --warning-subtle:     #FFFBEB;
  --warning-border:     #FDE68A;
  --warning-foreground: #92400E;

  /* Danger */
  --danger:            #DC2626;
  --danger-subtle:     #FEF2F2;
  --danger-border:     #FECACA;
  --danger-foreground: #991B1B;

  /* Info */
  --info:            #2563EB;
  --info-subtle:     #EFF6FF;
  --info-border:     #BFDBFE;
  --info-foreground: #1E40AF;

  /* Difficulty */
  --difficulty-beginner:        #16A34A;
  --difficulty-beginner-bg:     #F0FDF4;
  --difficulty-intermediate:    #2563EB;
  --difficulty-intermediate-bg: #EFF6FF;
  --difficulty-advanced:        #D97706;
  --difficulty-advanced-bg:     #FFFBEB;

  /* Status */
  --status-pending:              #71717A;
  --status-pending-bg:           #F4F4F5;
  --status-accepted:             #16A34A;
  --status-accepted-bg:          #F0FDF4;
  --status-needs-improvement:    #D97706;
  --status-needs-improvement-bg: #FFFBEB;

  /* Typography */
  --font-ui:      "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
  --font-display: "EB Garamond", "Adobe Jenson Pro", Georgia, serif;
  --font-sans:    "Inter", "Geist", ui-sans-serif, system-ui, sans-serif;

  --font-xs:   11px;
  --font-sm:   13px;
  --font-base: 14px;
  --font-md:   15px;
  --font-lg:   16px;
  --font-xl:   20px;
  --font-2xl:  24px;
  --font-3xl:  30px;

  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  --leading-tight:   1.2;
  --leading-snug:    1.35;
  --leading-normal:  1.5;
  --leading-relaxed: 1.6;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border Radius — 4px everywhere */
  --radius:      4px;
  --radius-sm:   4px;
  --radius-md:   4px;
  --radius-lg:   4px;
  --radius-xl:   4px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-none: none;
  --shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md:   0 4px 12px rgba(0, 0, 0, 0.08);
}
```
