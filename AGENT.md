# Agent Handoff

Last updated: 2026-08-10

## Project Architecture

- This repository is a static personal academic website deployed with GitHub Pages.
- There is no framework, package manager, bundler, or generated build output.
- `index.html` contains the complete home page:
  - fixed site header and hash-addressable view navigation
  - full-viewport profile/biography hero
  - reverse-chronological experience timeline
  - publication list
- `stylesheet.css` contains all active styling, responsive breakpoints, and accessibility preferences.
- Google Fonts supplies `Inter` for body/interface text and `Philosopher` for identity and section headings, with system fallbacks.
- `site.js` is a small dependency-free router and theme controller.
  - exactly one view is shown when JavaScript is enabled
  - URL hashes and browser back/forward navigation are preserved
  - without JavaScript, all sections remain visible as a normal scrolling document
  - one shared `IntersectionObserver` loads and plays publication previews only
    near the viewport while Publications is active
  - previews pause offscreen, outside Publications, or while the document is
    hidden, and resume from their current position when eligible again
  - reduced-motion and data-saving preferences leave publication posters static
  - light mode is the default, with a persistent dark-mode option stored under `xz-theme`
  - the toggle state, icon, accessible label, and browser theme color are updated together
- An inline script in `index.html` applies the saved theme before the stylesheet paints, preventing a light/dark flash.
- `images/` contains the profile photo and publication thumbnails.
- `images/publication-previews/` contains 20 optimized MP4 loops, their source
  manifest, and the local regeneration script.
- `pdfs/` contains the CV, dissertation, and locally hosted publication papers.
- `publications/` contains an older workshop PDF.
- `_config.yml` only sets the GitHub Pages site title.
- `index_old.html` and `css_old/style.css` are legacy references and are not part of the active page.

## Publication Video Previews

The active Publications view has 20 silent local MP4 previews. Each `<video>`
has a static poster, no controls, and stores the MP4 path in `data-src` so page
load does not request every clip. Existing publications retain their previous
images as posters; Simify uses a frame from its completed three-object stack.
`site.js` assigns `src` only after the shared observer reports that a preview is
near the viewport and Publications is the active, visible view.

The 6-8 second loops use longer source windows rather than slowed copies of the
old selections. Every encoder speed is greater than `1`; longer demonstrations
are compressed so the thumbnail can show setup, execution, and a visible
outcome. Two previews use paired source ranges to remove an interstitial without
dropping the completed result. ExpertGen, Golden Ticket, and ZeroBot use the
shared three-segment encoder to show three distinct tasks per paper:

- ExpertGen: BananaLift, OpenDrawer, and PushPear
- Golden Ticket: banana picking, cup pushing, and cube picking
- ZeroBot: bottle pickup, book nudge-and-grasp, and can push-up-ramp

Source attribution, source ranges, local source filenames, and exact encoder
invocations are recorded in:

```text
images/publication-previews/SOURCES.md
```

After downloading the documented source files into one temporary directory,
regenerate all previews with:

```sh
images/publication-previews/regenerate.sh /path/to/source-videos
```

Animated entries:

1. Test-Time Spatial Reasoning / Simify
2. VAP-TAMP
3. Scaling Short-Term Memory / PRISM
4. ExpertGen
5. Golden Ticket
6. ZeroBot
7. AnyTask
8. ParticleFormer
9. LLM-GROP
10. DKPrompt
11. OpenEQA
12. COWP
13. SLAP
14. Symbolic State Space Optimization (S3O)
15. Multimodal Embodied Attribute Learning
16. Robotic Table Wiping
17. GLAD
18. Learning to Ground Objects / TMOC
19. 360-Vision Attention Guidance
20. Task-Motion Planning for Safe and Efficient Urban Driving

Static entries:

1. Efficient Sim-to-Real Transfer of World-Action Models from Synthetic Priors
2. Data-Efficient Multitask DAgger
3. Symbol Grounding for Task and Motion Planning in Robotics
4. LLM+P

On the rendered timeline, the 2024 group is dissertation, DKPrompt, then OpenEQA
from top to bottom. VAP-TAMP is immediately above World-Action Models, LLM+P is
immediately above S3O, and Multimodal Embodied Attribute Learning is immediately
above Robotic Table Wiping.

Simify and S3O use author-provided local source videos. The world-action-model
entry remains static, but its extra-wide image is split at the horizontal
midpoint and stacked left-half-over-right-half for a readable publication-row
thumbnail.

Performance limits:

- H.264 MP4, `yuv420p`, fast-start, no audio
- 480 x 270 centered 16:9 crop
- 12 fps and 6-8 seconds
- CRF 27 with the slow preset
- no more than 600 KB per clip
- no more than 8 MB for all preview MP4s
- current generated set: 2,619,910 bytes total; largest file 287,466 bytes
- posters stay visible for no JavaScript, reduced motion, data saving, and load
  latency

## Publication Metadata

The Publications intro contains this author-note legend:

```text
* Equal contribution. † Equal advising.
```

Author symbols reflect the paper metadata and owner-provided corrections. They
are used for AnyTask, LLM-GROP, DKPrompt, OpenEQA, LLM+P, World-Action Models,
ExpertGen, and Simify. Edward Johns and Xiaohan Zhang are marked as equal
advisors on Simify. OpenEQA lists all 24 authors in official paper order instead
of abbreviating the list with "et al."

All 24 displayed author lists were re-audited on 2026-08-10 against the latest
primary paper represented by each entry. Consolidated journal entries use the
journal author list. When an older project page disagrees with a newer paper,
the latest paper governs; this applies to ExpertGen and Golden Ticket. The audit
corrected Roberto Martín-Martín's diacritics in the PRISM entry and found no
other author-order or author-membership changes.

Publication titles, preview media, and author names are intentionally
non-clickable. External destinations are exposed only in each entry's explicit
publication-links list.

Venue and version relationships use the following owner-confirmed metadata:

- World-Action Models: CVPR Embodied AI Workshop, 2026
- VAP-TAMP: IROS, 2026
- DKPrompt: CVPR Embodied AI Workshop, 2024 and ICRA Workshop on Robot
  Execution Failures, 2023, listed as separate workshop acceptances; its visible
  links are the project page and arXiv `2406.17659`
- GLAD: preprint, 2022
- Multimodal Embodied Attribute Learning: Autonomous Robots, 2023, extended
  from RSS, 2021

Publication links were also checked on 2026-08-10. The GLAD, TMOC, and urban
driving project links use their current `yding25.com` locations. The retired
PerceptoBot page was removed from the 360-vision entry; its explicit links retain
the arXiv paper and official YouTube demonstration. The About-page Shiqi Zhang
link uses Binghamton University's current faculty-profile URL because the former
personal-site certificate has expired.

## Repository Baseline

- Branch: `main`
- The redesign was developed against commit `7321b21` (`add zerobot paper`).
- Local `.DS_Store` changes are unrelated to the website and should not be
  included in future site commits.

## Redesign Scope Against The Previous Baseline

- The previous page was a 431-line, table-based academic homepage based on the
  Jon Barron-style template.
- The redesigned `index.html` is a 924-line semantic page using `header`, `nav`,
  `main`, `section`, and `article`.
- The previous page had:
  - a compact two-column biography/profile block
  - a `Selected Research` section
  - 10 publication entries
  - extensive inline table layout styles
- The redesigned page has:
  - metadata and favicon improvements
  - a fixed top navigation bar with active-view underlines
  - hash-routed About, Experience, and Publications views
  - a full-viewport hero with a compact desktop portrait/identity row, biography, and icon-based profile links
  - a seven-entry experience timeline
  - a semantic, chronological publication timeline
  - 24 consolidated work entries from 2020 through 2026
  - an accessible dark/light mode switch with pre-paint initialization and persistence
  - explicit image dimensions, lazy loading, descriptive alt text, and accessible landmarks
  - a skip link and no persistent footer
- `stylesheet.css` is also a full redesign and is currently 1,136 lines.
- `site.js` is a new 232-line progressive-enhancement layer.
- The redesign uses light-first white and optional black canvases with the
  existing violet accent system, Inter/Philosopher typography, responsive
  layouts, visible focus states, and reduced-motion support.

## Current Design

The site now uses a light-first editorial research-portfolio system inspired by
the restraint and typography on `riadoshi.github.io`: a 760px reading column,
Inter body text, Philosopher display headings, a compact portrait/identity About
composition, dense publication rows, and small purposeful transitions. The
default canvas is pure white, optional dark mode uses a pure black canvas, and
the established violet links and highlights remain in both modes. A header
control persists the choice across reloads and hash navigation and keeps all
three views visually consistent. The Publications view also uses locally hosted,
observer-loaded 6-8 second MP4 loops for the 20 entries with attributable
footage.

Implemented entries, ordered visually from top/newest to bottom/oldest:

1. Sudo AI, Senior Research Scientist, Jun 2026-present
2. Boston Dynamics AI Institute, Roboticist, May 2024-Jun 2026
3. Meta AI (FAIR), Research Scientist Intern in Embodied AI, May-Dec 2023
4. The University of Texas at Austin, Visiting PhD Student (LARG), Jan-Apr 2023
5. Google DeepMind, Student Researcher in Robotics, Mar-Aug 2022
6. State University of New York at Binghamton, PhD in Computer Science (AIR), Aug 2020-May 2024
7. Renmin University of China, B.Eng. in Computer Science, Sep 2015-May 2019

Dates and role wording were checked against the public LinkedIn profile (`https://www.linkedin.com/in/xiaohan-z/`) and the local CV at `pdfs/Xiaohan_Zhang_Resume.pdf`.

## Completed Work

The following work was present in the working tree before this handoff task:

- Replaced the legacy table-based page with semantic HTML.
- Rebuilt the visual design around a dark, full-viewport profile hero and a publication section; the later editorial redesign made every view dark.
- Added responsive behavior for desktop, tablet, mobile, and short mobile viewports.
- Added accessibility basics: skip link, landmarks, focus styles, alt text, ARIA labels, and reduced-motion handling.
- Expanded the publication list from 10 selected papers to 24 consolidated works.
- Added 2026 publication entries and their local thumbnail assets.
- Consolidated duplicate workshop/conference/journal versions into single publication entries where noted in `index.html`.

The experience task added:

- Updated the page title, metadata, hero role, and biography for the current Sudo AI position.
- Added `Experience` and `Publications` navigation labels.
- Initially changed the hero jump link to Experience; it was later removed once tab navigation made it redundant.
- Added seven reverse-chronological experience/education entries with exact month ranges and official links.
- Uses `Boston Dynamics AI Institute` in the timeline per the preferred display wording.
- Removed the small contextual lines for the institute rename, Chris Paxton, Peter Stone, and Shiqi Zhang.
- Displays `The University of Texas at Austin` as the organization and links
  `LARG` in the Visiting PhD Student role to Peter Stone's page.
- Displays `AIR` after the Binghamton PhD role and links it to the AIR lab page.
- Experience links have no default underline and gain one on hover.
- Added a compact date/marker/content timeline on desktop and a stacked timeline on mobile.
- Kept the section unframed and card-free so it matches the existing academic design.
- Restored the hero to the full viewport height after the section preview read as unintended whitespace.
- Removed redundant invalid `aria-label` attributes from ordinary lists after HTML validation.
- Removed duplicate anchor spacing so `#experience` and `#research` land directly below the fixed header.
- Hid the redundant `About` nav item at 360px and narrower so `Experience`, `Publications`, and `CV` remain visible.

The tabbed-view task added:

- Added `site.js` with dependency-free routes for `#about`, `#experience`, and `#publications`.
- Preserved the old `#research` URL by replacing it with `#publications`.
- Added browser back/forward support and dynamic document titles.
- Added progressive enhancement: all three sections remain visible when JavaScript is disabled.
- Added an active-tab underline and a blurred header; the final redesign uses the same dark header across every view.
- Added subtle view-entry animation, publication thumbnail lift/shadow, publication row movement, and experience marker/content hover states.
- Limited movement-based hover effects to fine-pointer devices.
- Paused autoplay publication videos whenever Publications is not active.
- Kept `prefers-reduced-motion` support for CSS and scripted scrolling.

The width/icon/background cleanup added:

- Reduced the shared desktop content width from 1080px, first to 820px and ultimately to 760px.
- Removed the Experience prompt at the bottom of About.
- Removed the copyright/Back to top footer entirely.
- Removed the ZeroBot hero background image and overlay in favor of a solid near-black background.
- Replaced text-only Email, Google Scholar, X, and LinkedIn links with circular icon controls.
- Added accessible names, native titles, and visible hover/focus tooltips to the icon controls.
- Used Lucide mail and graduation-cap shapes under the ISC license; X and LinkedIn use compact brand monograms.
- Reduced navigation labels to weight 500 and active navigation to 600 for a cleaner typographic hierarchy.

The publication-media cleanup added:

- Removed the universal 16:10 publication thumbnail canvas.
- Removed image padding and the gray wrapper background that created artificial empty bands.
- Reduced the desktop publication media column from 220px to 140px.
- Rendered images at their intrinsic aspect ratios with the border applied directly to the media.
- Kept videos at 16:9 because their moving preview needs a stable frame.
- Capped stacked mobile thumbnails at 240px while preserving their intrinsic ratios.
- Moved hover border/shadow feedback from the empty wrapper to the actual image or video.

The publication-preview upgrade added:

- Replaced 19 existing publication images with silent, looping MP4 previews,
  added a video-first Simify entry, and retained static posters for every clip.
- Built three-task montages for ExpertGen, Golden Ticket, and ZeroBot instead
  of stretching or repeating a single task.
- Added a single shared `IntersectionObserver` with a 320px vertical preload
  margin.
- Deferred all MP4 source assignment through `data-src`.
- Paused previews when offscreen, when Publications is inactive, on document
  visibility loss, and on page hide.
- Preserved playback position during normal pause/resume cycles.
- Kept posters static for reduced-motion and `saveData` preferences.
- Added an active-view fallback for browsers without `IntersectionObserver`.
- Added `images/publication-previews/SOURCES.md` and
  `images/publication-previews/regenerate.sh`.
- Removed the superseded 4.4 MB `images/teaser-combined.mp4` OpenEQA source
  from the active site assets.

The editorial redesign added:

- Unified About, Experience, Publications, and the header under one
  theme-aware palette; the current canvases are white in the default theme and
  black in dark mode.
- Narrowed the canonical reading column to 760px.
- Added Google-hosted `Inter` for body/interface text and `Philosopher` for the name, brand, section headings, and publication years.
- Replaced the centered desktop About stack with a 148px portrait/identity row, full-width biography, and left-aligned profile controls.
- Kept the mobile About view stacked and centered, with smaller portrait/type scales for short and 320px viewports.
- Left-aligned Experience and Publications titles and their short violet rules.
- Tightened publication titles to 17px, metadata to 14px, links to 14px, and row spacing to a denser academic rhythm.
- Tightened Experience dates, roles, details, and row spacing while preserving the vertical chronology.
- Standardized the header as translucent and theme-aware on every view.
- Refined the view transition to a 10px, 360ms eased entrance and reduced publication hover movement to 3px.
- Preserved white publication figure backgrounds where needed for diagram legibility.

The light/dark theme task added:

- Added an icon-only sun/moon control to the fixed header with visible keyboard focus.
- Set light mode as the default and stored explicit user choices in
  `localStorage` under `xz-theme`.
- Added pre-paint theme initialization in the document head to avoid a flash of the wrong palette.
- Added dynamic `aria-label`, `title`, and `aria-pressed` states to the theme control;
  `aria-pressed` reports whether dark mode is active.
- Updated `<meta name="theme-color">` when the active theme changes.
- Replaced hardcoded dark-only colors with semantic CSS variables for the canvas, alternate surface, text hierarchy, header, controls, timeline, metadata, and hover shadows.
- Uses pure white and black canvases while retaining the original violet
  accents, text hierarchy, and white publication figure backgrounds.
- Added `color-scheme` declarations so browser-native controls match the active theme.
- Hid the redundant About navigation item at 480px and below, then tightened header gaps at 360px and below so the theme control fits at 320px.
- Preserved reduced-motion behavior for theme and view transitions.

## TODO

- [x] Verify experience dates and exact role names from LinkedIn/public sources.
- [x] Add `Experience` to the primary navigation and hero jump link.
- [x] Update the hero for the current Sudo AI role.
- [x] Add and responsively style the seven-entry experience timeline.
- [x] Check fixed-header anchor offsets for `#experience` and `#research`.
- [x] Validate HTML and inspect local links/assets.
- [x] Visually verify desktop, tablet, mobile, short-mobile, and 320px layouts.
- [x] Convert About, Experience, and Publications into hash-addressable views.
- [x] Add active navigation states, restrained hover feedback, and view transitions.
- [x] Verify direct hashes, old-hash compatibility, back/forward navigation, and no-JavaScript fallback.
- [x] Narrow the shared desktop layout to 760px.
- [x] Remove the hero prompt and footer.
- [x] Add accessible profile icons and tooltips.
- [x] Replace the About background image with a solid color.
- [x] Replace fixed-aspect publication canvases with intrinsic-ratio thumbnails.
- [x] Verify wide, standard, and tall publication images on desktop and mobile.
- [x] Replace the teal palette with neutral white/black canvases and the
  lavender/amethyst accent system.
- [x] Verify color contrast and inspect all three views on desktop and mobile.
- [x] Convert all three views and the header to layered dark surfaces.
- [x] Install the Inter/Philosopher typography system.
- [x] Recompose the desktop About view into a portrait/identity editorial row.
- [x] Left-align section titles and tighten publication/experience typography.
- [x] Verify the redesign at 1440x1000, 390x844, 390x620, and 320x568.
- [x] Add an accessible dark/light mode control to the header.
- [x] Persist the theme choice and apply it before first paint.
- [x] Convert all dark-specific colors to semantic theme tokens.
- [x] Verify both themes across all views at desktop and phone widths.
- [x] Replace attributable publication thumbnails with optimized local MP4 loops.
- [x] Add observer-driven loading, playback, pause, and preference handling.
- [x] Document source attribution, selected ranges, regeneration, and limits.
- [x] Remove the superseded OpenEQA source video.
- [x] Verify the theme control, reload persistence, route persistence, metadata, and horizontal overflow in Chromium.
- [x] Review personal wording and dates before publishing.
- [x] Stage the intended HTML, CSS, handoff file, and publication images without accidentally staging `.DS_Store`.
- [x] Commit and push after approval.

## Important Design Decisions

- Keep the site framework-free: plain HTML/CSS, a small JavaScript router, and Google Fonts as the only external presentation dependency.
- Treat the three content areas as navigation views, not an ARIA tab widget. They have distinct URL hashes and behave like document destinations.
- Keep all views in the DOM for search indexing and no-JavaScript access; JavaScript only controls visibility and state.
- Keep `#about`, `#experience`, and `#publications` as the canonical routes, with `#research` as a compatibility alias.
- Keep the same translucent, theme-aware header across About, Experience, and Publications.
- Use hover transforms only inside `@media (hover: hover) and (pointer: fine)` so touch devices do not retain sticky hover states.
- Preserve the current semantic and accessible structure.
- Keep the experience section visually quiet and professional. It should be a compact chronology, not a collection of decorative cards.
- Keep light mode as the default; dark mode is an explicit user choice, not an
  operating-system-derived default.
- Store the explicit theme in `localStorage` under `xz-theme`, and keep `html[data-theme]` as the CSS source of truth.
- Apply saved theme state in the inline head script before CSS paints; do not move initialization exclusively into deferred JavaScript.
- Maintain the paired palette and typography:
  - dark canvas and paper `#000000`, lifted surface `#17131e`, ink `#f5f2f8`
  - light canvas, paper, and surface `#ffffff`, ink `#19151f`
  - dark accent `#a77bf3`, light accent `#7443bf`
  - `Inter` for body, interface, publication, and experience text
  - `Philosopher` for the brand, name, section headings, and publication years
- Keep purple concentrated in navigation, links, rules, markers, controls, and
  hover states; keep the underlying views neutral white or black.
- Do not add purple gradients, glowing background shapes, or decorative blobs.
- Keep corners restrained (`4px` is the current publication media radius).
- Do not put page sections inside floating cards.
- Keep all main content within the `--max-width: 760px` layout.
- Keep the hero at `100svh`; tab navigation is sufficient to indicate the other views.
- Keep the desktop About view as a 148px portrait/identity row with the biography and controls spanning below it.
- Stack and center the About identity on mobile while keeping the biography left-aligned.
- Keep every view background solid in both themes rather than using publication images or decorative gradients.
- Keep the icon links circular, compact, and labeled through `aria-label`, `title`, and hover/focus tooltips.
- Keep navigation labels at weight 500, active navigation at 600, and Philosopher display headings at 700.
- Keep section titles left-aligned with a short violet rule.
- Do not restore the footer or in-view next-section prompts while hash-based view navigation is active.
- Keep experience entries newest-first so the chronology runs from current role at the top to education at the bottom.
- Use text, dates, a thin line, and small markers instead of organization-logo cards.
- Use global `scroll-padding-top` for fixed-header anchors; do not also add section `scroll-margin-top`.
- On viewports 480px and narrower, the brand is the About/home control and the separate `About` nav item is hidden.
- Keep the circular theme control at 34px on larger screens and 32px at 420px and below; preserve the 12px header/navigation gaps at 360px and below.
- The publication section is intentionally exhaustive and chronological, not merely "selected research."
- Keep publication images at their intrinsic aspect ratios; do not restore a universal aspect-ratio wrapper or internal image padding.
- Keep animated publication previews at a stable 16:9 ratio and keep static
  publication images at their intrinsic ratios.
- Do not put preview MP4 URLs in `src` or nested `<source>` elements in the
  document. Keep them in `data-src` so `site.js` controls loading.
- Preserve posters as the non-animated fallback and do not substitute footage
  from a different project when attributable media is unavailable.
- Keep all previews muted, looped, control-free, and locally hosted.
- Maintain one shared publication preview observer rather than one observer per
  video.
- When a paper exposes several distinct first-party robot tasks, prefer a
  concise montage of complete task outcomes over repeating one task.
- Extend the attributable source window when a preview needs more runtime; do
  not slow a shorter selection merely to reach the 6-8 second target.
- Recheck the per-file and total media budgets after changing any source range
  or encoder setting.
- Keep the publication media column at 140px on desktop and cap stacked mobile media at 240px.
- Keep publication titles at 17px/600, metadata at 14px, and compact row spacing unless readability testing justifies a change.
- Publication versions are intentionally consolidated into one work entry where they represent the same project.
- Do not modify legacy files unless the active page needs content recovered from them.
- Do not revert pre-existing working-tree changes or unrelated `.DS_Store` changes.

## Build And Test Commands

No build step is required.

Serve the site locally from the repository root:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Direct view URLs:

```text
http://localhost:8000/#about
http://localhost:8000/#experience
http://localhost:8000/#publications
```

Useful repository checks:

```sh
git status --short
git diff --check
git diff --stat HEAD -- index.html stylesheet.css site.js
node --check site.js
rg -n 'href="#|id="' index.html
rg -n 'src="images/|href="pdfs/' index.html
```

Validate publication previews:

```sh
for file in images/publication-previews/*.mp4; do
  ffprobe -v error \
    -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt,codec_type \
    -show_entries format=duration,size \
    -of json "$file"
done
du -ch images/publication-previews/*.mp4
```

Validate the HTML:

```sh
npx --yes html-validate@10.0.0 index.html
```

The macOS `/usr/bin/tidy` bundled on this machine is too old to recognize HTML5 landmarks and reports false errors for `header`, `nav`, `main`, and `section`.

Optional screenshot checks with the installed Google Chrome:

```sh
npx --yes playwright@1.54.1 screenshot \
  --channel chrome \
  --viewport-size '1440,1000' \
  http://127.0.0.1:8000/#experience \
  /tmp/xiaohan-experience.png
```

For final UI verification, capture or inspect at least:

- desktop: 1440 x 1000
- tablet/narrow desktop: 900 x 900
- mobile: 390 x 844
- short mobile: 390 x 620
- narrow mobile: 320 x 568

Confirm:

- no horizontal overflow
- no overlapping header, hero, timeline, or publication content
- both themes remain readable and visually consistent
- the theme choice survives reloads and navigation between views
- the theme control exposes the correct label and pressed state
- anchor navigation lands below the fixed header
- text and organization names wrap cleanly
- all local images and PDFs return successfully
- keyboard focus remains visible

## Verification Status

Completed on 2026-08-08:

- `npx --yes html-validate@10.0.0 index.html`: passed
- `node --check site.js`: passed
- `git diff --check`: passed
- all local `images/`, `pdfs/`, and `publications/` references in `index.html`: present
- local HTTP checks for `/`, `/stylesheet.css`, and `/pdfs/Xiaohan_Zhang_Resume.pdf`: `200`
- Playwright screenshots inspected at 1440x1000, 900x900, 390x844, 390x620, and 320x568 for the final dark editorial redesign
- automated Chromium checks passed for one-visible-view routing, active navigation state, dynamic titles, direct hashes, `#research` compatibility, browser history, hover transforms, video pausing, no-JavaScript fallback, and horizontal overflow
- the final desktop About composition, stacked mobile About layout, all-dark Experience timeline, dense Publications view, and non-wrapping desktop date column were visually inspected
- publication media geometry checks passed for every image on desktop and mobile: intrinsic aspect ratios are preserved, wrappers match rendered media heights, image padding is zero, and no horizontal overflow occurs
- final palette contrast checks passed: ink/dark 17.85:1, muted/dark 8.04:1, muted/Experience 7.66:1, link/dark 10.08:1, publication metadata/dark 9.23:1, role/Experience 12.30:1, and dark/accent 6.38:1
- Inter and Philosopher loaded correctly in browser screenshots, with system fallbacks retained in CSS
- no observed overlap, clipped navigation, broken timeline alignment, or horizontal overflow

Completed on 2026-08-09 for the theme switch:

- `npx --yes html-validate@10.0.0 index.html`: passed
- `node --check site.js`: passed
- `git diff --check`: passed
- automated Chromium theme checks passed at 1440x1000, 900x900, 390x844, 390x620, and 320x568
- light is the default in a fresh browser context
- the control switches both directions and updates `aria-label`, `aria-pressed`, and `<meta name="theme-color">`
- the `xz-theme` choice persists after reload and while navigating About, Experience, and Publications
- exactly one routed view remains visible and no horizontal overflow occurs in either theme
- settled light-mode screenshots were inspected for all three views at 1440x1000 and 390x844, plus About at 900x900, 390x620, and 320x568
- light-mode contrast checks passed on white: ink 17.97:1, muted 5.57:1,
  links 8.52:1, metadata 6.58:1, roles 8.77:1, and white/accent 6.37:1

Completed on 2026-08-10 for publication video previews:

- 20 local previews passed strict `ffprobe` validation: H.264, `yuv420p`,
  480x270, 12 fps, no audio, and 6.67-7.33 seconds
- the largest preview is 287,466 bytes and all previews total 2,619,910 bytes,
  below the 600 KB per-file and 8 MB aggregate limits
- all 20 previews use complete source coverage rather than slowed copies of
  the prior selections; every speed factor is greater than `1`
- Simify uses the author-provided complete three-object stacking sequence and
  local paper; S3O uses the author-provided complete mobile-manipulation video
- the world-action-model image is a 690x524 composite made by placing the
  original right half below the original left half
- browser midpoint captures confirm that ExpertGen, Golden Ticket, and ZeroBot
  each render three distinct tasks in sequence
- temporal and endpoint contact sheets confirm setup, execution, and visible
  outcomes without post-success resets, half-finished next actions, black
  interstitials, charts, or adjacent title cards
- initial About loading requests no MP4 files; at the top of Publications on a 900x900 viewport, only four near-viewport previews load and play
- scrolling through Publications loads all 20 previews; offscreen previews pause and resume from their prior position when visible again
- all previews pause when navigating to About or Experience, when the document becomes hidden, and on page hide
- browser history, direct hash routing, keyboard navigation, publication-link focusability, and the no-`IntersectionObserver` fallback passed in Chromium
- reduced-motion, Save-Data, and no-JavaScript modes retain static poster images without requesting or playing previews
- dark and light screenshots were inspected at 1440x1000, 900x900, 390x844, 390x620, and 320x568, including mid-page, reduced-motion, and no-JavaScript states
- targeted Simify, world-action-model, and S3O browser checks passed at
  1440x1000 and 390x844 in both themes, including intrinsic dimensions, local
  links, deferred S3O loading, playback, and responsive geometry
- no layout shift, incorrect media crop, overlap, or horizontal overflow was observed
