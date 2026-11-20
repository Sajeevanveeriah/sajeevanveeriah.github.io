# sajeevanveeriah-portfolio design reference

The colours, type, spacing and components in use in this project, read from its stylesheets and components on 10 November 2026. Read this before interface work and update it when the styles change.

## Stack

| Package | Version |
|---|---|
| next | 15.5.28 |
| react | ^19.1.1 |

## Style sources

| File | Characters of CSS |
|---|---|
| src/app/globals.css | 56764 |
| src/app/robotics.css | 6580 |

## Colour

Custom properties that hold colours:

| Token | Value | Defined in |
|---|---|---|
| --navy | #0f1e33 | src/app/globals.css |
| --amber | #f5b700 | src/app/globals.css |
| --bg | #f4f5f7 | src/app/globals.css |
| --surface | #eceff3 | src/app/globals.css |
| --raised | #ffffff | src/app/globals.css |
| --ink | #0f1e33 | src/app/globals.css |
| --muted | #46566b | src/app/globals.css |
| --line | #d6dce4 | src/app/globals.css |
| --line-strong | #a3afbf | src/app/globals.css |
| --rail-line | rgb(120 136 160 / 0.4) | src/app/globals.css |
| --mark | #6b7b91 | src/app/globals.css |
| --accent | #f5b700 | src/app/globals.css |
| --accent-hover | #ffc72c | src/app/globals.css |
| --on-accent | #0f1e33 | src/app/globals.css |
| --accent-text | #8a5d00 | src/app/globals.css |
| --focus | #0f1e33 | src/app/globals.css |
| --media | #eef1f5 | src/app/globals.css |
| --spot | rgb(245 183 0 / 0.12) | src/app/globals.css |

Literal colour values used most in the stylesheets:

| Value | Uses |
|---|---|
| #f5b700 | 14 |
| #0f1e33 | 9 |
| #eef1f6 | 8 |
| #b3bfcf | 7 |
| #34496a | 5 |
| #1c2c43 | 4 |
| #26395a | 4 |
| #000 | 4 |
| #0b1523 | 4 |
| #8c9bb0 | 3 |
| rgb(0 0 0 / 0.3) | 3 |
| #fff | 3 |
| #ffc72c | 2 |
| #eef1f5 | 2 |
| #0c1829 | 2 |
| #5b7192 | 2 |
| #172a46 | 2 |
| #f4f5f7 | 1 |

## Type

Font stacks declared:

| font-family | Uses |
|---|---|
| var(--font-archivo), system-ui, -apple-system, 'Segoe UI', sans-serif | 1 |

Font sizes declared:

| font-size | Uses |
|---|---|
| 15px | 27 |
| 14px | 19 |
| 16px | 15 |
| 17px | 8 |
| 18px | 8 |
| 24px | 4 |
| clamp(18px, 1.6vw, 21px) | 3 |
| 13px | 3 |
| 22px | 3 |
| 21px | 2 |
| clamp(28px, 3vw, 40px) | 2 |
| 20px | 2 |

## Spacing and layout

| Media query | Uses |
|---|---|
| (max-width: 480px) | 2 |
| (prefers-reduced-motion: reduce) | 2 |
| (max-width: 1100px) | 1 |
| (max-width: 1024px) | 1 |
| (max-width: 720px) | 1 |
| (max-width: 400px) | 1 |
| print | 1 |
| (max-width: 1024px) and (min-width: 801px) | 1 |

| max-width | Uses |
|---|---|
| 720px | 3 |
| 100% | 2 |
| 900px | 2 |
| 580px | 2 |
| 440px | 1 |
| 620px | 1 |

## Shape and depth

| border-radius | Uses |
|---|---|
| 2px | 18 |
| 8px | 2 |
| 4px | 1 |
| 50% | 1 |
| 0 | 1 |

| box-shadow | Uses |
|---|---|
| var(--shadow-lift) | 2 |
| inset 0 -2px 0 var(--amber) | 1 |
| inset 3px 0 0 var(--amber) | 1 |
| var(--shadow) | 1 |
| 0 0 0 6px rgb(245 183 0 / 0.3) | 1 |

## Other tokens

Custom properties for type, spacing, shadow and motion:

| Token | Value | Defined in |
|---|---|---|
| --shadow | 0 1px 2px rgb(15 30 51 / 0.05), 0 12px 32px rgb(15 30 51 / 0.07) | src/app/globals.css |
| --shadow-lift | 0 2px 4px rgb(15 30 51 / 0.06), 0 18px 40px rgb(15 30 51 / 0.12) | src/app/globals.css |
| --mono | ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace | src/app/globals.css |
| --ease | cubic-bezier(0.2, 0.7, 0.2, 1) | src/app/globals.css |
| --radius | 2px | src/app/globals.css |
| --radius-small | 2px | src/app/globals.css |
| --gutter | clamp(16px, 5vw, 48px) | src/app/globals.css |
| --rail | clamp(8px, 2.5vw, 32px) | src/app/globals.css |
| --frame | calc(min(var(--max), 100% - 2 * var(--gutter)) + 2 * var(--rail)) | src/app/globals.css |
| --max | 1200px | src/app/globals.css |
| --header | 72px | src/app/globals.css |

## Components

- src/components: ArticleTools.tsx, ContactForm.tsx, DecodeText.tsx, EngineeringLab.tsx, InteractiveRoadmap.tsx, JournalIndex.tsx, LoopingVideo.tsx, Masthead.tsx, MobileNavigation.tsx, Motion.tsx, PictureMedia.tsx, ProjectCard.tsx, ProjectDossierDrawer.tsx, ProjectMedia.tsx, ProjectShowcaseGrid.tsx, ProjectVideo.tsx, QueueSimulator.tsx, RecordArticle.tsx, SiteFooter.tsx, SiteSearch.tsx, SystemEvidence.tsx, SystemsBus.tsx, Theme.tsx, WorkCatalogue.tsx, icons.tsx

## Hardware-grade redesign (20 November 2026)

- Light and dark palettes share Night Navy `#0F1E33` and Volt Amber `#F5B700`; dark theme pairs `#091320` primary canvas, `#0f1e33` surface panels and `#16263d` raised panels. First-visit theme defaults to `system` (`prefers-color-scheme`) with persistent user overrides via header button or footer select.
- Every media container (`.media-frame`, `.eng-lab-canvas-wrap`) locks to `16:9` (`1280x720`) with `object-fit: contain` inside `PictureMedia` (`<picture>` serving AVIF, WebP and JPG) and `LoopingVideo` (`autoplay muted loop playsinline`, off-screen `IntersectionObserver` pause, `prefers-reduced-motion: reduce` static poster fallback).

## Brand files

- public/favicon.png
- public/assets/image/20260827-Sajeevan-Veeriah-SV-Logo-Rev00.webp
