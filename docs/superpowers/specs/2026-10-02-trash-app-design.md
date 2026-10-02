# Trash App — Design

Date: 2026-10-02

## Goal

Add a "Trash" app to the macOS-style portfolio. Opening it shows a Finder-like window listing dreams and goals that Dwi Natasari Juwita has not reached yet, or can no longer reach. A sidebar lists the dreams; the pane on the right shows the selected dream's details. The tone is honest content with light macOS humor in the UI (Put Back, Empty). It appears on desktop (Dock) and on mobile (home screen grid).

## Constraints

- No Apple artwork: the Trash icon is our own SVG drawn in the style of the macOS Trash, not a copy of it.
- No images inside the window; icons are SVG glyphs only.
- Site copy is in English.
- Content is fixed in a data file; nothing the visitor does changes it (Put Back and Empty never remove items).

## Icon and placement

### Desktop

- Trash is the last Dock item, after Instagram, separated from the other apps by a thin vertical divider, as on macOS.
- The icon is a silver-grey, semi-transparent wire-mesh cylinder with a round lid, drawn as SVG, in its "full" state (crumpled paper showing at the top). Unlike the other icons it has no coloured tile behind it.
- It behaves like every other Dock app: magnification, "Trash" tooltip, open-indicator dot.

### Mobile

- Trash is the last app in the home screen grid, labelled "Trash" (the mobile dock keeps its current four apps).
- On mobile the same glyph sits on a light grey tile so it lines up with the other grid icons and stays visible on the wallpaper.

### Code touch points

- `src/data/apps.js`: new `trash` entry, last in the list, `placement: 'dock'`, `dockGroup: 'end'`.
- `src/components/desktop/Dock.jsx`: renders a divider before the first app whose `dockGroup` is `'end'`.
- `src/components/AppIcon.jsx`: supports an icon without a tile (`tile: false`), with an option to force a tile for the mobile grid.

## Window layout

Desktop window about 720×480.

```
┌──────────────────────────────────────────────────────────┐
│ ● ● ●                    Trash                           │
├──────────────────────────────────────────────────────────┤
│ Trash — 4 dreams                              [ Empty ]  │
├────────────────┬─────────────────────────────────────────┤
│ NOT YET        │  📄  Travel the World Solo              │
│ ▸ Travel Solo  │      ● Not yet                          │
│   Umrah with…  │  ─────────────────────────────────────  │
│                │  Where        Dreams › Travel           │
│ NO LONGER      │  Date Added   College                   │
│ POSSIBLE       │  Date Deleted —                         │
│   Study at UGM │  ─────────────────────────────────────  │
│   Accounting   │  Story…                                 │
│                │  WHAT CAME INSTEAD (if any)             │
│                │                          [ Put Back ]   │
└────────────────┴─────────────────────────────────────────┘
```

### Top bar

- Left: "Trash — 4 dreams" (count from the data). Right: "Empty" button.

### Sidebar (about 200px)

- Two groups with small uppercase headers: "Not Yet", then "No Longer Possible". Within a group, items keep data order.
- Each item: small document glyph and the dream title (truncated). The selected item is highlighted and marked `aria-current="true"`.
- The first item ("Not Yet" group first) is selected when the window opens.

### Detail pane

- Header: document glyph, title, status badge ("Not yet" in amber, "No longer possible" in grey).
- Get Info–style rows: Where (`Dreams › <Category>`), Date Added, Date Deleted ("—" when empty).
- Story paragraph(s), then a "What came instead" section only when the dream has one.
- "Put Back" button at the bottom right.

### Narrow layout (mobile, or a window narrower than about 520px)

- Decided by the window's own width with a Tailwind container query, not by device type.
- Shows the list first, full width. Tapping a dream shows its detail with a "‹ Trash" back button at the top; the back button returns to the list and focuses the dream that was open.
- On wide layouts the back button is hidden and both panes show.

## Humor

### Put Back

- **Not yet**: enabled. Clicking shows "Still on the list — working on it." below the button, in an `aria-live="polite"` region. The message resets when another dream is selected.
- **No longer possible**: disabled, with a visible caption next to it: "The original location no longer exists." (a play on Finder's real error). A visible caption, not a tooltip, so it works on touch and with disabled buttons.

### Empty

- Clickable. Opens a macOS-style alert centred over the window content (a `role="alertdialog"` with a dim backdrop):
  - Title: "Are you sure you want to permanently erase these dreams?"
  - Body: "Some dreams are worth keeping, even the ones that didn't happen."
  - One button: "Keep Them".
- Opening moves focus to "Keep Them". "Keep Them" or Escape closes it and returns focus to "Empty". The trash is never emptied.

## Content

Data lives in `src/data/dreams.js`. Fields: `id`, `title`, `status` (`'not-yet'` | `'no-longer-possible'`), `category`, `added`, `deleted` (optional), `story`, `instead` (optional).

**Study at UGM**: no-longer-possible · Education · Added: High school · Deleted: 2018
> Back in high school, Universitas Gadjah Mada was *the* dream. It's one of Indonesia's best state universities, and its reputation speaks for itself. But it wasn't only about the name. I wanted to live far from home, learn to stand on my own, and see who I'd become in a completely new place. In 2018, that door closed, and my path went somewhere else.

**Work in Accounting**: no-longer-possible · Career · Added: Junior high · Deleted: 2018
> It started in junior high with bookkeeping class. I genuinely looked forward to every lesson. In senior high, accounting became a proper subject, and I enjoyed it just as much. Then university admissions came around, and I was accepted into Management instead.
>
> Instead: I later switched careers and became a developer. I still love making things add up, just in code now.

**Travel the World Solo**: not-yet · Travel · Added: College
> Since college, I've wanted to travel to different countries on my own. There's something exciting about figuring out a new place by yourself, and it doubles as the best kind of refreshing. This one isn't going anywhere. It's just waiting to be put back.

**Umrah with My Parents**: not-yet · Faith · Added: College
> Since college, I've dreamed of visiting the Holy Land together with my parents, to feel the calm of worshipping there side by side with the people who raised me. Not gone, just waiting for the right time.

Data order: Travel the World Solo, Umrah with My Parents, Study at UGM, Work in Accounting.

## Testing

- `dreams` data: every dream has the required fields and a known status; `deleted`/`instead` are optional.
- `apps`: `trash` is registered last, with `dockGroup: 'end'`.
- Dock: a divider renders before Trash and only once.
- TrashApp:
  - first "Not Yet" dream is selected on open;
  - clicking a sidebar item changes the detail;
  - Put Back is enabled for not-yet (and shows the message), disabled with the caption for no-longer-possible;
  - Empty opens the alert, focus lands on "Keep Them", Escape and "Keep Them" close it and focus returns to Empty;
  - "What came instead" only renders when present; Date Deleted shows "—" when empty;
  - selecting a dream switches the narrow view to detail, and "‹ Trash" returns to the list.
- Container-query visibility is CSS and is checked by hand in the browser at desktop and phone widths.
