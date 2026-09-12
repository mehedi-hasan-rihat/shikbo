# Shikbo — Design System

A centralized token system and design guidelines for the Shikbo
Assignment & Learning Analytics platform.

Every visual decision in this product should answer one question:
**"Does this improve information hierarchy or usability?"**
If not, remove it.

---

## Design Philosophy

The interface should feel like a serious internal tool used daily
by instructors and students — not a marketing page or an AI demo.

Prioritize:
1. Typography
2. Spacing
3. Alignment
4. Information hierarchy
5. Borders
6. Consistent component geometry
7. Subtle semantic state colors

References in spirit (not to copy): Linear, GitHub, Vercel dashboard,
modern education admin software.

### Do not use

- Gradients
- Glassmorphism
- Excessive shadows
- Neon or saturated colors
- Large rounded cards
- Excessive pill-shaped UI
- Oversized or decorative typography
- Decorative illustrations
- Unnecessary icons
- Excessive animation
- Colorful backgrounds
- "AI dashboard" or generic SaaS landing-page aesthetics

The interface is primarily white and light gray with restrained semantic color.

---

## Color Tokens

All colors must be consumed via CSS custom properties.
Do not hardcode hex values inside components.

### Background

```css
--background:        #FFFFFF;
--background-subtle: #FAFAFA;
--background-muted:  #F5F5F5;
--background-hover:  #F8F8F8;
--background-active: #F3F4F6;
```

### Surface

```css
--surface:        #FFFFFF;
--surface-subtle: #FCFCFC;
--surface-hover:  #FAFAFA;
```

### Border

```css
--border:        #E5E7EB;
--border-subtle: #ECECEC;
--border-strong: #D1D5DB;
```

### Text

```css
--text-primary:   #111827;
--text-secondary: #4B5563;
--text-muted:     #6B7280;
--text-disabled:  #9CA3AF;
--text-inverse:   #FFFFFF;
```

### Primary

```css
--primary:            #2563EB;
--primary-hover:      #1D4ED8;
--primary-active:     #1E40AF;
--primary-subtle:     #EFF6FF;
--primary-foreground: #FFFFFF;
```

### Success

```css
--success:            #16A34A;
--success-subtle:     #F0FDF4;
--success-border:     #BBF7D0;
--success-foreground: #166534;
```

### Warning

```css
--warning:            #D97706;
--warning-subtle:     #FFFBEB;
--warning-border:     #FDE68A;
--warning-foreground: #92400E;
```

### Danger

```css
--danger:            #DC2626;
--danger-subtle:     #FEF2F2;
--danger-border:     #FECACA;
--danger-foreground: #991B1B;
```

### Info

```css
--info:            #2563EB;
--info-subtle:     #EFF6FF;
--info-border:     #BFDBFE;
--info-foreground: #1E40AF;
```

---

## Semantic Tokens — Assignment Difficulty

Difficulty is a semantic state, not a decorative label.
Do not use bright or saturated colors.

```css
--difficulty-beginner:          #16A34A;
--difficulty-beginner-bg:       #F0FDF4;

--difficulty-intermediate:      #2563EB;
--difficulty-intermediate-bg:   #EFF6FF;

--difficulty-advanced:          #D97706;
--difficulty-advanced-bg:       #FFFBEB;
```

---

## Semantic Tokens — Submission Status

Status colors communicate state, not decoration.

```css
--status-pending:                 #6B7280;
--status-pending-bg:              #F3F4F6;

--status-accepted:                #16A34A;
--status-accepted-bg:             #F0FDF4;

--status-needs-improvement:       #D97706;
--status-needs-improvement-bg:    #FFFBEB;
```

---

## Typography

Font stack: `Inter, Geist, system-ui, sans-serif`

Typography should be compact and professional.
Body text is 14px. Avoid oversized headings.
Dashboard page titles: 24–28px. Not hero-scale.

### Size Tokens

```css
--font-xs:   12px;
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

Use `600` for important headings. Avoid excessive bold text throughout UI.

### Line Height Tokens

```css
--leading-tight:   1.2;
--leading-snug:    1.35;
--leading-normal:  1.5;
--leading-relaxed: 1.6;
```

---

## Spacing

Base unit: 4px. All spacing must come from this scale.

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

Most UI spacing uses: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`.
Do not use arbitrary values.

---

## Border Radius

Use restrained radius. Do not apply large radii everywhere.

```css
--radius-sm: 4px;
--radius-md: 6px;   /* default for controls */
--radius-lg: 8px;   /* cards and panels */
--radius-xl: 10px;
```

- Default controls (buttons, inputs, badges): `6px`
- Cards and panels: `8px`
- Do not use `16px`, `20px`, or `24px` radius as defaults.

---

## Borders and Shadows

Borders are more important than shadows in this product.
Most containers rely on `background + border`, not `background + shadow`.

### Default border

```css
border: 1px solid var(--border);
```

### Shadow Tokens

```css
--shadow-none: none;
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md:   0 4px 12px rgba(0, 0, 0, 0.06);
```

Use shadows only when elevation is genuinely required (e.g., dropdowns, modals).
Avoid floating-card aesthetics in dashboard layouts.

---

## Layout

### Desktop

```
Sidebar:       220–240px (fixed)
Main content:  fluid
Max content width: ~1200–1400px
Page horizontal padding: 24–32px
Page vertical padding:   28–32px
```

Use a strict grid. Align page titles, cards, tables, charts, filters,
and action buttons to the same content grid. Avoid random positioning.

### Responsive Breakpoints

| Context       | Behavior                                     |
|--------------|----------------------------------------------|
| Desktop       | Sidebar + content side by side               |
| Tablet        | Collapsible sidebar                          |
| Mobile        | Sidebar becomes a drawer; cards 1-column;    |
|               | charts 1-column; tables scroll horizontally  |

Do not simply shrink the desktop layout on mobile.

---

## Component Guidelines

### Sidebar

- Background: white or near-white
- Right border: `1px solid var(--border)`
- Nav item height: 36–40px
- Nav item padding: `8px 12px`
- Nav item radius: `6px`
- Default state: transparent background
- Active state: very subtle neutral background (`var(--background-active)`)
- Do not make the active item look like a large colorful button
- Icons: small, secondary to text labels

### Cards

Cards are data containers, not marketing components.

```
background: var(--surface)
border:     1px solid var(--border)
radius:     var(--radius-lg)   /* 8px */
padding:    16–20px
```

Avoid large padding, dramatic shadows, gradient headers, and oversized icons.

### KPI / Metric Cards

Compact structure:

```
Label         (12–13px, muted)
Value         (24–28px, semibold)
Supporting    (12–13px, secondary)
```

Example:
```
Total Submissions
128
+12 this week
```

Do not place giant decorative icons in KPI cards.

### Tables

Tables are a primary UI surface in this product.

```
border-collapse: separate
header background: subtle muted or white
header typography: 12–13px, medium, muted
row height: minimum 52px
row borders: subtle horizontal separators only
```

Avoid excessive vertical borders. Keep table actions compact.

### Buttons

| Variant   | Style                              |
|----------|------------------------------------|
| Primary   | Solid primary background           |
| Secondary | White background, border           |
| Ghost     | Transparent background             |
| Danger    | Semantic red                       |

```
Default height: 36px
Compact height: 32px
Large height:   40px
Radius:         var(--radius-md)  /* 6px */
Typography:     13–14px, medium
```

Avoid oversized CTA buttons.

### Inputs

```
height:      36–40px
border:      1px solid var(--border-strong)
radius:      var(--radius-md)  /* 6px */
focus:       subtle primary border/ring
placeholder: var(--text-muted)
label:       13px, medium
help text:   12–13px, muted
```

Forms should feel dense and professional.

### Badges

```
height:     24–28px
padding:    4px 8px
typography: 12px, medium
radius:     var(--radius-sm) or var(--radius-md)
```

Use semantic background colors. Prefer slightly rounded rectangles over pill shapes.

---

## Charts

Charts are analytical surfaces, not decorative elements.

- Background: white
- Grid lines: very subtle (`var(--border-subtle)`)
- Axis labels: `var(--text-muted)`
- Tooltip: white surface, border, `var(--shadow-sm)`
- Colors: use semantic palette tokens; avoid rainbow series
- For multi-series charts: use a controlled semantic palette

Charts should prioritize readability, comparison, trends, and actionable insights.

---

## Animation

Animation communicates state changes. It does not decorate the interface.

```
Duration:  150–200ms for normal UI transitions
Properties: opacity, background-color, border-color, transform
```

Avoid:
- Excessive bouncing or spring effects
- Dramatic page transitions
- Large-scale animations
- Unnecessary motion

---

## Reusable Component Library

All shared UI lives in `src/components/ui/`. **Always use these before writing custom markup.**
If a component does not exist yet, add it here and document it in this file.

| Component | File | Notes |
|-----------|------|-------|
| `Button` | `ui/Button.tsx` | Variants: `primary`, `secondary`, `ghost`, `danger`, `danger-ghost`. Sizes: `sm`, `default`, `lg`. Accepts `loading` prop. |
| `Input` | `ui/Input.tsx` | Wraps a `<input>` with label, hint, and error wired via ARIA. |
| `Textarea` | `ui/Textarea.tsx` | Same field pattern as Input. |
| `Select` | `ui/Select.tsx` | Typed `options` array, optional placeholder. |
| `Card` / `KpiCard` | `ui/Card.tsx` | `Card` variants: `default`, `sm`, `kpi`. Use `KpiCard` for metric surfaces. |
| `Badge` / `DifficultyBadge` / `StatusBadge` | `ui/Badge.tsx` | Domain-aware wrappers over the base `Badge`. Use `DifficultyBadge` and `StatusBadge` instead of raw badges for domain values. |
| `Dialog` | `ui/Dialog.tsx` | Accessible modal. Props: `open`, `onClose`, `title`, `description`, `size`, `footer`. Sizes: `sm`, `default`, `lg`, `xl`. |
| `Tabs` | `ui/Tabs.tsx` | Keyboard-navigable tab set. Pass a `tabs` array with `id`, `label`, `content`. |
| `Dropdown` | `ui/Dropdown.tsx` | Positioned menu. Pass `trigger`, `groups` (with items), and `align`. |
| `EmptyState` | `ui/EmptyState.tsx` | Empty list/page state. Props: `title`, `description`, `action`. |
| `LoadingState` | `ui/LoadingState.tsx` | Skeleton rows. Variants: `list` (default), `page`. |
| `ErrorState` | `ui/ErrorState.tsx` | Error surface with `role="alert"`. Props: `title`, `message`, `action`. |

Assignment-specific components live in `src/components/assignments/`:

| Component | File | Notes |
|-----------|------|-------|
| `AssignmentForm` | `assignments/AssignmentForm.tsx` | Create/edit assignment form. Props: `action`, `defaultValues`, `submitLabel`. Instructor flows only. |
| `SubmissionForm` | `assignments/SubmissionForm.tsx` | Student submission form. Fields: URL (required), note (optional). Props: `action`, `defaultUrl`, `defaultNote`, `submitLabel`, `onCancel`. Client component using `useActionState`. |
| `ReviewForm` | `submissions/ReviewForm.tsx` | Instructor review form. Fields: status (select), feedback (textarea). Props: `action`, `defaultStatus`, `defaultFeedback`. Client component using `useActionState`. |
| `StatusDonutChart` | `analytics/StatusDonutChart.tsx` | Recharts donut chart for submission status distribution. Props: `data: StatusDistribution`. Client component. Shows "No submissions yet" empty state. |
| `AssignmentAnalysisTable` | `analytics/AssignmentAnalysisTable.tsx` | Table of all assignments with difficulty, student count, needs-improvement count, accepted count, and acceptance rate with inline progress bars. Sorted by most struggle. Client component. |
| `AtRiskStudentsTable` | `analytics/AtRiskStudentsTable.tsx` | Table of students with ≥2 latest submissions at needs_improvement. Shows name, email, count, total submissions, last active. Client component. |
| `StudentProgressChart` | `analytics/StudentProgressChart.tsx` | Student-facing progress visualization. Stacked horizontal bar + horizontal bar chart (Recharts). Shows accepted / needs improvement / pending / not started distribution across all active assignments. Props: `data: StudentProgressDistribution`. Client component. |

Layout components live in `src/components/layout/`:

| Component | File | Notes |
|-----------|------|-------|
| `AppSidebar` | `layout/AppSidebar.tsx` | Server component. Composes desktop sidebar + mobile drawer. |
| `SidebarNav` | `layout/SidebarNav.tsx` | Client component. Active link via `usePathname`. |
| `UserMenu` | `layout/UserMenu.tsx` | Client dropdown in sidebar footer. Shows initials avatar + role. |
| `MobileSidebar` | `layout/MobileSidebar.tsx` | Client slide-in drawer. Auto-closes on route change. |

---

## CSS Component Classes

These utility classes are defined in `src/app/globals.css` under `@layer components`.
Use them directly in JSX instead of rewriting the same styles.

### Layout

| Class | Purpose |
|-------|---------|
| `.app-shell` | Root flex wrapper for sidebar + content layouts |
| `.content-area` | Main content region beside the sidebar |
| `.page-container` | Standalone page wrapper (max-width + padding) |

### Page structure

| Class | Purpose |
|-------|---------|
| `.page-header` | Flex row: title block left, actions right |
| `.page-title` | `24px`, semibold, primary text |
| `.page-subtitle` | `14px`, muted |

### Cards

| Class | Purpose |
|-------|---------|
| `.card` | Standard card — `surface` bg, border, `8px` radius, `20px` padding |
| `.card-sm` | Compact card — `16px` padding |
| `.card-kpi` | KPI/metric card with flex column layout |
| `.card-kpi__label` | `13px`, muted |
| `.card-kpi__value` | `24px`, semibold |
| `.card-kpi__support` | `13px`, secondary |

### Forms

| Class | Purpose |
|-------|---------|
| `.field` | Wraps label + input + hint/error |
| `.field-label` | `13px`, medium |
| `.field-hint` | `12px`, muted |
| `.field-error` | `12px`, danger — add `role="alert"` |
| `.input` | Base text input |
| `.input--error` | Error state border/ring |
| `.textarea` | Textarea — inherits `.input` focus styles |
| `.select` | Styled `<select>` with chevron |

### Buttons

| Class | Purpose |
|-------|---------|
| `.btn` | Base button — all variants extend this |
| `.btn-primary` | Solid primary |
| `.btn-secondary` | White + border |
| `.btn-ghost` | Transparent |
| `.btn-danger` | Solid red |
| `.btn-danger-ghost` | Text-only red |
| `.btn-sm` | 32px height |
| `.btn-lg` | 40px height |

### Badges

| Class | Purpose |
|-------|---------|
| `.badge` | Base badge |
| `.badge-beginner` / `.badge-intermediate` / `.badge-advanced` | Difficulty |
| `.badge-pending` / `.badge-accepted` / `.badge-needs-improvement` | Submission status |
| `.badge-neutral` | Generic neutral |

### Tables

| Class | Purpose |
|-------|---------|
| `.table-wrapper` | Horizontal scroll container |
| `.table` | Full-width table with token-based styles |

### Sidebar

| Class | Purpose |
|-------|---------|
| `.sidebar` | Fixed 240px sidebar — hidden on mobile via CSS |
| `.sidebar-nav` | Flex column of nav items |
| `.sidebar-nav-item` | Single nav link/button — add `.active` or `aria-current="page"` |
| `.sidebar-section-label` | `12px` uppercase section heading |

### State surfaces

| Class | Purpose |
|-------|---------|
| `.callout` | Base inline callout block |
| `.callout-success` / `.callout-warning` / `.callout-danger` / `.callout-info` | Semantic variants |
| `.empty-state` | Centered empty state container |
| `.empty-state__title` | `14px`, medium |
| `.empty-state__description` | `13px`, muted, max 320px |
| `.skeleton` | Pulsing loading placeholder |
| `.sr-only` | Screen-reader-only (visually hidden) |

### Overlays

| Class | Purpose |
|-------|---------|
| `.dialog-backdrop` | Fixed full-screen backdrop |
| `.dialog` | Modal container — default max 480px |
| `.dialog-sm` / `.dialog-lg` / `.dialog-xl` | Size variants |
| `.dialog-header` / `.dialog-body` / `.dialog-footer` | Dialog sections |
| `.dialog-title` / `.dialog-description` | Dialog typography |
| `.dropdown-menu` | Positioned dropdown surface |
| `.dropdown-item` | Menu item |
| `.dropdown-item-danger` | Danger-tinted menu item |
| `.dropdown-separator` | Horizontal rule between groups |

### Tabs

| Class | Purpose |
|-------|---------|
| `.tabs` | Tabs wrapper |
| `.tabs-list` | Tab button row (border-bottom) |
| `.tabs-trigger` | Single tab button — add `.active` or `aria-selected="true"` |
| `.tabs-panel` | Tab content panel |

### Responsive utilities

| Class | Behavior |
|-------|---------|
| `.mobile-nav-wrapper` | Hidden on desktop; shows mobile top bar + drawer |
| `.grid-cols-responsive` | Collapses to 1 column below 768px |

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|---------|
| ≥ 1025px (desktop) | Sidebar visible; `.mobile-nav-wrapper` hidden |
| 769–1024px (tablet) | Sidebar narrows to 200px |
| ≤ 768px (mobile) | Sidebar hidden; `.mobile-nav-wrapper` shown; `.content-area` padding reduced; `.page-header` stacks vertically |

---

## Implementation Rules

1. All color, spacing, typography, radius, and shadow values must
   come from the token definitions above.
2. Do not hardcode hex values, pixel values, or arbitrary numbers
   inside individual components when a token exists.
3. Tokens are defined as CSS custom properties on `:root`.
4. Tailwind config maps to these tokens so utility classes consume the same semantic values.
5. **Use existing components from `src/components/ui/` before writing custom markup.**
   Adding a new pattern? Add the component to `src/components/ui/`, then document it here.
6. **Adding or changing a CSS class in `globals.css`? Update the class table in this file.**
7. When adding a new component, verify it passes the design rule:
   **every visual decision must improve information hierarchy or usability.**

---

## CSS Custom Properties — Full Reference

Paste this block into your global stylesheet root:

```css
:root {
  /* Background */
  --background:        #FFFFFF;
  --background-subtle: #FAFAFA;
  --background-muted:  #F5F5F5;
  --background-hover:  #F8F8F8;
  --background-active: #F3F4F6;

  /* Surface */
  --surface:        #FFFFFF;
  --surface-subtle: #FCFCFC;
  --surface-hover:  #FAFAFA;

  /* Border */
  --border:        #E5E7EB;
  --border-subtle: #ECECEC;
  --border-strong: #D1D5DB;

  /* Text */
  --text-primary:   #111827;
  --text-secondary: #4B5563;
  --text-muted:     #6B7280;
  --text-disabled:  #9CA3AF;
  --text-inverse:   #FFFFFF;

  /* Primary */
  --primary:            #2563EB;
  --primary-hover:      #1D4ED8;
  --primary-active:     #1E40AF;
  --primary-subtle:     #EFF6FF;
  --primary-foreground: #FFFFFF;

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
  --status-pending:              #6B7280;
  --status-pending-bg:           #F3F4F6;
  --status-accepted:             #16A34A;
  --status-accepted-bg:          #F0FDF4;
  --status-needs-improvement:    #D97706;
  --status-needs-improvement-bg: #FFFBEB;

  /* Typography */
  --font-xs:   12px;
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

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 10px;

  /* Shadows */
  --shadow-none: none;
  --shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md:   0 4px 12px rgba(0, 0, 0, 0.06);
}
```
