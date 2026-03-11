# Design System

> This project uses a **token-based design system** built entirely on CSS Properties.

---

## File structure

```
src/styles/
├── tokens.css     ← All design tokens (single source of truth)
├── reset.css      ← Modern CSS reset
├── global.css     ← Base styles, focus ring, scrollbar, selection
└── utilities.css  ← Composable utility classes (.container, .flex, .grid, .btn…)
```

These files are imported in `BaseLayout.astro` in the order above so cascade is predictable.

---

## Tokens (`src/styles/tokens.css`)

### Colors

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#fafafa` | Cards, panels |
| `--color-surface-2` | `#f5f6f8` | Nested surfaces |
| `--color-border` | `#e6e6e6` | Borders, dividers |
| `--color-primary` | `#F87537` | Brand, CTAs, links |
| `--color-primary-2` | `#fd7e14` | Brand, CTAs, links |
| `--color-accent` | `#000000` | Highlights, CTA buttons |
| `--color-text` | `#231F20` | Body text |
| `--color-text-muted` | `#5c6470` | Secondary text |
| `--color-text-subtle` | `#8f96a3` | Placeholders, metadata |

### Typography

Fluid type scale driven by `clamp()`:

| Token | Min → Max |
|---|---|
| `--text-xs` | 0.70rem → 0.75rem |
| `--text-sm` | 0.82rem → 0.875rem |
| `--text-base` | 0.95rem → 1rem |
| `--text-md` | 1.05rem → 1.125rem |
| `--text-lg` | 1.20rem → 1.375rem |
| `--text-xl` | 1.40rem → 1.75rem |
| `--text-2xl` | 1.80rem → 2.5rem |
| `--text-3xl` | 2.20rem → 3.375rem |
| `--text-4xl` | 2.80rem → 5rem |

### Spacing

`--space-1` (0.25rem) through `--space-32` (8rem) in multiples of 4.

### Animation

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
```

---

## Utility classes (`utilities.css`)

### Container
```html
<div class="container">          <!-- max 1280px -->
<div class="container container--sm">  <!-- max 640px -->
<div class="container container--lg">  <!-- max 1024px -->
```

### Flex / Grid
```html
<div class="flex items-center justify-between gap-4">
<ul  class="grid col-auto gap-6">   <!-- auto-fit responsive grid -->
<ul  class="grid col-3 gap-6">      <!-- 3-column fixed grid -->
```

### Typography
```html
<p class="text-sm font-semibold text-muted tracking-widest uppercase">
<h2 class="text-2xl font-bold">
```

### Surfaces
```html
<div class="surface bordered rounded shadowed">
<div class="surface-2 rounded">
```

### Sections
```html
<section class="section">       <!-- padding-block: 6rem -->
<section class="section section--sm">  <!-- padding-block: 4rem -->
```

---

## Button atom (`.btn`)

Defined globally in `Header.astro` so buttons work anywhere.

```html
<a class="btn btn--primary btn--md">Primary</a>
<a class="btn btn--ghost btn--lg">Ghost</a>
```

| Modifier | Description |
|---|---|
| `btn--primary` | Filled orange, glows on hover |
| `btn--ghost` | Transparent, bordered |
| `btn--sm / --md / --lg` | Size variants |

---

## React Islands

Place interactive components in `src/components/react/`. Use CSS Modules (`.module.css`) for scoped styles that still consume design tokens via `var(--…)`.

### Hydration directives

| Directive | When to use |
|---|---|
| `client:load` | Hydrate immediately (above the fold) |
| `client:idle` | Hydrate when browser is idle |
| `client:visible` | Hydrate when element enters viewport |
| `client:only="react"` | Skip SSR entirely (auth-gated UIs) |

```astro
<!-- Astro file -->
import Counter from '@/components/react/Counter';
<Counter client:load initialCount={5} />
```

---

## Adding a new page

1. Create `src/pages/my-page.astro`
2. Import and use `PageLayout`:
   ```astro
   ---
   import PageLayout from '../layouts/PageLayout.astro';
   ---
   <PageLayout title="My Page" description="…">
     <!-- content -->
   </PageLayout>
   ```
3. Add a link to `navLinks` in `Header.astro`.
