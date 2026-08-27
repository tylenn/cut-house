# tylen.ca — mockup notes (from client V2 .mov walkthroughs)

Source: `1_Desktop_Webpage-Mockup_TYLEN.CA_2026 (V2).mov` (1280×720, 40s)
        `2_Mobile_Webpage-Mockup_TYLEN.CA_2026 (V2).mov` (720×1280, 50s)
Frames extracted at 1s intervals → `reference/mockup-frames/{desktop,mobile}/`

## Overall
Stark white minimal portfolio. Black text, mid-grey secondary. No borders, no cards,
no shadows, no rounded corners. Helvetica/Inter-style neo-grotesque, all lowercase for
nav and project titles. Everything is tight, small type — roughly 11–13px body.
Content is video-first: every grid tile is a silently autoplaying, looping muted clip
(the frames show them all playing different footage at each timestamp), not a static image.

## Desktop layout
Two columns, full-bleed, no max-width centering.

- **Left rail (~33% width, fixed/sticky, full height)**
  - `tylen` (bold-ish, black) + `cinematographer  editor` (grey) on one line, top-left, ~30px in
  - Nav below: `projects`, `information` — stacked, active item goes black/bold, inactive grey
  - Nav items get a light grey highlight block on hover (see 24s frame)
  - Footer pinned to bottom-left: `©2026 Tylen. All rights reserved. No part of this website may be reproduced without permission.` (tiny, grey)
- **Right column (~66%)**: content, starts flush at the very top of the viewport (y≈16px)

### Projects (index)
2-column grid of 16:9 video tiles, ~2px gutter, tiles run to the right edge of the viewport.
Under each tile: title (bold, black, lowercase) + role line (grey).
Observed items, in order:
  1. curves at home — editor, colorist
  2. mandy's falloween — director, editor
  3. summer minute — director of photography, editor
  4. sony & daytimers — director of photography, editor
  5. curves, home/wear — director of photography, editor
  6. turo, host feedback — editor, colorist
  7. camcorder — director of photography, editor
  8. finn wolfhard, tad — behind the scenes
Note: the turo tile shows a purple/violet fill on the right portion — that's the actual
footage (Turo brand purple), not a placeholder.

### Information
Single column starting at ~33% from left, ~45% wide. Sections, each with a bold black
heading and grey/black body:
  - **Contact** — `info@tylen.ca` (grey, link) / `Available globally.`
  - **Application** — `Full client list and commercial portfolio available upon request.`
  - **Description** — 3-line bio + underlined grey `read more` toggle that expands a second
    paragraph and swaps the toggle to `close`. Copy:
    > Tylen is a cinematographer & editor who delivers creative visuals rooted in
    > purpose-driven storytelling. Combining his academic background in advertising and
    > cinematography, he blends the intersection between thoughtful compositions with a
    > destinct visual language.
    >
    > Driven by an on-going curiosity for archival material, Tylen draws from past forms
    > to shape his contemporary work.
    (note: "destinct" is his typo — confirm before shipping)
  - **Clients** — plain list, alphabetical on desktop:
    Ben Key (New West 199X), Crave, Curves by Sean Brown, Dine Alone Records,
    Finn Wolfhard, Harry Rosen, Salomon, Slushy Noobz, Sony Music Group, Tridel, Turo

### Project detail
  - Full-width 16:9 hero video with a large semi-transparent grey circular play button
  - Title below in bold black: `finn wolfhard — trailers after dark`
  - Credits: 2-col table, label left (grey) / value right-aligned (grey), narrow (~230px):
    `director → marcus`, `prod. → cory, luno blvd`, `dp → jon`, `bts → tylen`
  - Below: 2-col grid of additional clips — mixed aspect ratios (a 4:5 portrait next to a
    16:9), each with its own play button
  - One clip shows a picture-in-picture inset video with its own play button

## Mobile layout
Single column, edge-to-edge media (0 side margin on tiles), ~20px side padding on text.

- **Sticky header**: `tylen` (grey) `cinematographer, editor` (grey) left; `+` icon right.
  Note the mobile subtitle uses a comma — desktop uses no separator.
- `+` toggles a dropdown that pushes content down: `projects` / `information`.
  When open the `+` becomes a `—` (minus). Items are black; current page appears bold.
- **Projects**: stacked 16:9 clips full-bleed, title + role beneath, ~2px gaps.
  Mobile role labels are abbreviated vs desktop: `dop, editor` instead of
  `director of photography, editor`. Titles reordered too:
  `sony music & daytimers`, `home/wear, curves`, `turo host feedback`.
- **Information**: same sections, but clients are in a different (unsorted) order:
  Salomon, Sony Music Group, Crave, Finn Wolfhard, Tridel, Turo, Harry Rosen,
  Curves by Sean Brown, Dine Alone Records.
  Bio says "Tylen is a DP & editor" (desktop says "cinematographer & editor").
  Footer at bottom: bold `instagram` link, then `Tylen. All rights reserved.` left /
  `© 2026` right on one row.
- **Project detail**: hero video vertically centered in the viewport with play button,
  title bold beneath, then credits table (label left grey / value right-aligned grey):
  - curves at home → `edit, color / tylen`, `director / sean`, `dop / christina`, `prod. / iva`
  - mandy's falloween → `dir, dp, editor / tylen`, `gaffer / robbie`, `talent / mandy + martin`

## Open questions for the client
- Desktop vs mobile disagree on: the tagline separator, role label abbreviations, project
  title wording, and client-list order. Pick one canonical set?
- Is `camcorder` / `finn wolfhard, tad` the full project list, or a subset?
- Where do the videos live — self-hosted files, Vimeo, or Mux?
- Instagram link only appears on mobile. Desktop too?

---

# ROUND 2 — rebrand + intro + info-as-overlay

Client update (Aug 2026): the site is no longer a namesake portfolio. New domain,
new name: **cut house**, positioned as a production company.
Tagline in the intro lockup: `a global production services company`.
The top-left `tylen` wordmark becomes `cut house`.

## Intro sequence (`reference/mockup-frames/intro/`, from `cut house intro.mov`)
Mock runs 20s; the real thing should be ~3s total. Beats:

1. **0.0–0.6s** — flat bone field, `#EAEBDD`. Nothing else.
2. **0.6–2.0s** — `c` `u` `t` fade in one at a time, spread edge-to-edge across the
   vertical middle at enormous letter-spacing, then track *in* toward the left.
   Letters are heavy-weight lowercase grotesque, near-black on the bone.
3. **~2.2s** — hard cut: full-bleed video behind, letters now a small white `cut`
   lockup at left (~28px from edge, vertically centred).
4. **~2.6s** — `house` reveals after `cut` → `cut house`.
5. **~3.0s** — subline fades in beneath, small caps-height white:
   `a global production services company`
6. **~6.5s in the mock** — cut to white. Lockup flips to black, subline drops.
   Just `cut house` bold black, left-aligned, vertically centred.
7. **~9s** — nav (`projects` / `information`) and the project grid fade up.
   The wordmark **does not move** — it stays exactly where it landed, large, in
   the left rail. That's the payoff: the intro lockup *becomes* the sidebar logo.

So the left rail in the final state differs from V2: nav sits at the very top-left,
and `cut house` is set large (~44px) and vertically centred in the rail, not small
at the top. Footer copyright stays bottom-left.

## Info as an overlay, not a page (`reference/mockup-frames/{loading,blur}/`)
Both reference clips are **tylermitchell.co**, not client work — they're the
interaction reference.

- Desktop (`loading/`): "About" opens a dense multi-column info sheet *over* the
  index grid. The grid behind fades to a near-white ghost — still faintly visible,
  never fully gone. `Close` sits top-right where the nav was.
- Mobile (`blur/`): same idea but the backdrop is genuinely **blurred** —
  soft colour blobs from the grid bleed through behind the text. `Close` is a
  persistent floating label near the bottom centre, following the scroll.

This replaces the dedicated information page from V2. Keep `/info` as a real route
(deep links, SEO), but present it as an overlay over the grid.

## Still open
- Client will send fuller info-page copy.
- Which footage backs the intro? Currently the "curves at home" clip.
- Does the whole client/credits structure survive the production-company reframing
  (i.e. is it still "his" roles, or the company's)?
