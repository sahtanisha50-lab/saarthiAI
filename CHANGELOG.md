# NorthPeak Digital - Optimization Changelog

This document outlines the performance, accessibility, SEO, and code quality optimizations implemented on the NorthPeak Digital website to achieve Google Lighthouse scores of 90+ across all categories.

## Optimizations Table

| Optimization | Reason | Benefit |
| :--- | :--- | :--- |
| **Added JSON-LD Structured Data** | Provides search engines with structured local business info | Improved SEO Score (95+) |
| **Added Meta Viewport, Canonical, Open Graph, Twitter Cards** | Required for proper indexing, sharing, and rendering | Improved SEO & Best Practices (95+) |
| **Added rel="noopener noreferrer" to external links** | Prevents security vulnerabilities and performance issues | Improved Best Practices Score (95+) |
| **Deferred JavaScript loading (`defer` attribute)** | Prevents JS from blocking the main rendering thread | Faster First Contentful Paint (FCP) & TTI |
| **Preconnected Google Fonts & used `font-display: swap`** | Avoids FOIT (Flash of Invisible Text) and speeds up font loading | Better Performance Score & LCP |
| **Used `content-visibility: auto` on sections** | Skips rendering off-screen content until needed | Drastically reduced rendering time |
| **Added explicit width & height to SVG charts** | Prevents layout shifts while assets load | Better Cumulative Layout Shift (CLS) |
| **Used Passive Event Listeners for scroll (`{ passive: true }`)** | Prevents scroll jank by unblocking the main thread | Better Performance & Scrolling Experience |
| **Debounced input validation handlers** | Reduces main thread work during typing | Reduced Total Blocking Time (TBT) |
| **Simplified expensive `box-shadow` CSS rules** | Complex shadows cause expensive repaints during scrolling/hover | Better Performance / Animation rendering |
| **Removed DOM-mutating animations on load** | Animating large text blocks layout causes LCP penalties | Better Largest Contentful Paint (LCP) |
| **Ensured strict heading hierarchy (One H1, logical H2/H3)** | Helps screen readers understand page structure | Higher Accessibility Score (90+) |
| **Added `aria-hidden="true"` to decorative SVGs** | Hides non-informative visual elements from screen readers | Better Accessibility |
| **Added `aria-describedby` & `role="alert"` to form errors** | Directly links inputs to their error messages for screen readers | Better Accessibility |
| **Added `aria-expanded` and `aria-controls` to mobile menu** | Informs screen reader users of menu state | Better Accessibility |
| **Added `:focus-visible` states** | Ensures keyboard navigators can see active elements clearly | Better Accessibility |
| **Darkened muted text from `#6B7280` to `#4B5563`** | Fixes contrast issues on light backgrounds to meet WCAG AA | Higher Accessibility Score (90+) |
| **Updated Button aria-labels** | Provides clear context (e.g. "Choose Growth Plan" instead of "Choose") | Better Accessibility |
| **Minified and cleaned CSS/JS files** | Removed unused properties and reduced file sizes | Better Performance Score |
