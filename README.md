# Web Dev Club — website

Static site. No framework, no build step. Open `index.html` in a browser and it runs.

## Files

```
index.html      Home — the finished reference page
about.html      About
events.html     Events (working — pulls from data/events.js)
projects.html   Projects (working — pulls from data/projects.js)
resources.html  Resources
join.html       Join
blog.html       Blog
styles.css      All styling. Tokens at the top, sections numbered.
main.js         Nav toggle, active-page marker, event/project rendering.
data/events.js  Event list. Edit this, not the HTML.
data/projects.js Project list. Edit this, not the HTML.
assets/         Images and icons.
```

## Two decisions and why

**Projects are cards only, not individual detail pages.** Fourteen extra files to
maintain for content that doesn't exist yet. Each card links out to a live demo
and a repo, which is what a visitor actually wants.

**Events and projects live in data files, not in HTML.** An officer who can't code
can add an event by copying one block in `data/events.js`. The rendering happens
once in `main.js`.

They're `.js` files rather than `.json` because `fetch()` is blocked when a page is
opened directly from a folder (`file://`). A `<script>` tag isn't. That keeps the
site working without running a local server.

## Interactive parts

- **Projects filter** — buttons are generated from `data/projects.js`, so a new
  tech stack appears as a filter on its own. Count updates as you narrow.
- **Signup form** (`join.html`) — validates in the browser, errors appear beside
  the field and clear as you fix them, focus moves to the first problem, and a
  confirmation panel replaces the form on success. No server behind it yet:
  point it at a real endpoint when the club has one.
- **Motion** — three places only: hero reveal on load, stat counters on first
  scroll into view, project cards settling when a filter changes. All disabled
  under `prefers-reduced-motion`.

## Still to do

Each unfinished page has `TODO` comments marking the sections from the plan.
In rough priority order:

1. Replace the four numbers in the stats bar on `index.html` with real ones
2. About — leadership cards, story/milestones, values
3. Resources — workshop archive, link the Git/GitHub guide
4. Join — point the form at a real endpoint, add the Discord invite link
5. Blog — one real post
6. Swap every `href="#"` for a real link (Discord, GitHub, socials, form)
7. Add real screenshots to `assets/img/` and wire them into the project cards

## Notes

- Fonts load from Google Fonts. If judging happens offline, the fallback stack
  (Inter → Helvetica → Arial) keeps the layout intact.
- Colours, spacing and type sizes are all CSS custom properties in `:root`.
  Change one value, it updates everywhere.
- Responsive at 900px and 600px. Nav collapses to a toggle below 900px.
- Keyboard focus is visible, there's a skip link, and `prefers-reduced-motion`
  is respected.
