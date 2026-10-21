# Tab indicator — horizontal line (archived)

Industries tabs used this before switching to the left rail bar (same idea as `.ctrl-nav-item::before`, but horizontal). Keep for future tab rows or underlines.

## CSS (horizontal scale-in)

```css
.tab-indicator-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--ltx-black);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--tab-line-in, 0.62s) var(--tab-line-ease, cubic-bezier(0.37, 0.02, 0.14, 1));
  pointer-events: none;
}
.tab-indicator-line.is-on {
  transform: scaleX(1);
}
```

Tokens used on `#industryGrid`: `--industry-line-in`, `--industry-line-out`, `--industry-line-ease`.

## JS handoff (optional)

Animate outgoing tab to `scaleX(0)` with `--industry-line-out`, incoming to `scaleX(1)` with `--industry-line-in`. Skip on last tab if the line sat on the bottom border only.

See git history on `deck/index.html` (`industry-tab__line`, `handoffLine`) before rail migration.
