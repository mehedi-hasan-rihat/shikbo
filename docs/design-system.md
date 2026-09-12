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

## Implementation Rules

1. All color, spacing, typography, radius, and shadow values must
   come from the token definitions above.
2. Do not hardcode hex values, pixel values, or arbitrary numbers
   inside individual components when a token exists.
3. Tokens are defined as CSS custom properties on `:root`.
4. Tailwind config should map to these tokens so utility classes
   consume the same semantic values.
5. When adding a new component, verify it passes the design rule:
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
