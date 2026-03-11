# Purrfect Breeds

A single-page responsive landing page for a fictional product: **Purrfect Breeds** -- "Find the breed that matches your vibe."

Built with **Astro + TypeScript + React islands**.

## Setup

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build -> dist/
npm run preview    # preview production build
```

## What was built

### Page sections
- **Header** -- responsive nav bar with logo, navigation links, search bar, favorites icon. Collapses to a burger menu + slide-in drawer on tablet (<=1024px)
- **Hero** -- full-bleed background image with overlay text and "Explore breeds" CTA that scrolls to the breed explorer
- **Breed Explorer** (React island) -- fetches cat breeds from `https://catfact.ninja/breeds`, displays in a responsive grid (4 cols desktop / 3 tablet / 2 mobile), with search-by-name, filter-by-coat dropdown, and "Load more" pagination
- **Testimonial Carousel** (React island) -- keyboard-accessible horizontal carousel with prev/next controls
- **Footer** -- brand info, social links, sitemap columns, copyright

### Design system

| Layer | File | Purpose |
|:------|:-----|:--------|
| Tokens | `tokens.css` | Color palette, typography scale (clamp-based), spacing, radii, shadows, transitions, breakpoints |
| Reset | `reset.css` | Modern CSS reset |
| Global | `global.css` | Focus rings, scrollbar, selection, links, code blocks |
| Utilities | `utilities.css` | Container, typography, flex/grid helpers, spacing, visibility |
| Primitives | `primitives.css` | Reusable component patterns (see below) |

**Primitives:**
- `.btn` (`.btn--primary`, `.btn--dark`, `.btn--ghost`, `.btn--sm`, `.btn--lg`)
- `.card` (`.card--bordered`, `.card__media`, `.card__body`)
- `.tag` (`.tag--active`)
- `.icon-btn` (`.icon-btn--dark`)
- `.input`
- `.dropdown` (`.dropdown__item`, `.dropdown__item--active`)

All component-level CSS references tokens and primitives; hardcoded values are minimized.

### Accessibility
- Skip-to-content link
- Semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<blockquote>`)
- ARIA: `aria-label`, `aria-labelledby`, `aria-current="page"`, `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-live`, `aria-roledescription`, `role="search"`, `role="dialog"`, `role="listbox"`
- Keyboard navigation: burger menu (Escape to close), coat filter dropdown (Escape), carousel (Arrow keys), focus management on drawer open/close
- All decorative images/SVGs use `alt=""` or `aria-hidden="true"`
- Screen reader live regions announce filter result counts
- Proper `<label>` elements for all inputs (visually hidden where needed)

### SEO
- Semantic `<title>` and `<meta name="description">` per page
- Open Graph meta tags (`og:title`, `og:description`, `og:type`, `og:url`)
- Canonical URL
- `<meta name="theme-color">`
- Image `width`/`height` attributes for CLS prevention
- `loading="eager"` + `fetchpriority="high"` on hero; `loading="lazy"` on below-fold images

## Tradeoffs / what I'd improve with more time

- **Real breed images** -- currently using gradient placeholders; would integrate an image API or static assets
- **Search debouncing** -- search filters instantly; with a larger dataset, would add a debounce
- **Carousel auto-rotation** -- currently manual prev/next only; would add auto-rotate with pause-on-hover and a play/pause toggle
- **Dark mode** -- tokens are set up to support it; would add a `prefers-color-scheme` media query and toggle
- **E2E / unit tests** -- would add Playwright for key flows and Vitest for component logic
- **Pagination from API** -- currently fetches 20 breeds in one request; would implement true server-side pagination for larger datasets
- **Animation polish** -- card entrance animations, smoother carousel transitions
- **Image optimization** -- would use Astro's `<Image>` component for automatic format conversion and responsive srcsets
