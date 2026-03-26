# Implementation Plan — Case Study Accordion + Modal Upgrade

## Behaviour Summary

- **Row click** → accordion expands inline below the `.index-row` (replaces `modalManager.open`)
- **Grid tile click** → existing modal overlay opens, now rendering the full case study panel (sidebar + tabs + video)
- Everything else (hover card, grid, footer, resume drawer, dazzle header) is **untouched**

---

## Step 1 — `data.js`: Add `caseStudy` to each project

Add a `caseStudy` object to all 8 projects with:

```js
caseStudy: {
  eyebrow: '',         // e.g. 'Shopify Headless · E-commerce'
  description: '',     // 2–3 sentence project summary
  stats: [             // 2–3 items
    { label: '', value: '' }
  ],
  pills: [],           // tech tag strings
  tabs: [              // 1 tab per project (single .webm per project)
    {
      label: '',       // tab button text
      url: '',         // chrome bar URL string
      panelLabel: '',  // label shown in placeholder if no media
      notes: [         // 1–2 items
        { label: '', body: '' }
      ]
    }
  ]
}
```

**Featured projects** (full copy): Runners Rotation, Hummingbird Pantry, Refinements, Cultivated Sounds  
**Other 4** (abbreviated): Chef Portfolio, Printed Poster, Outrageous Payload, Huberts Crafts

---

## Step 2 — `row.css`: Append case study accordion styles

**No existing rules are modified.** Append new rules only:

- `.cs-wrap` — `max-height: 0; overflow: hidden; transition: max-height .55s cubic-bezier(.16,1,.3,1)`
- `.cs-wrap.open` — `max-height: 1400px`
- `.cs-body` — `display: grid; grid-template-columns: 300px 1fr; background: var(--cs-cream); border-radius: 3px; margin-bottom: 1.5rem`
- `.cs-side` — dark sidebar (padding, flex column, gap)
- `.cs-eyebrow`, `.cs-title`, `.cs-desc`, `.cs-stats`, `.cs-stat`, `.cs-stat-lbl`, `.cs-stat-val`
- `.cs-pills`, `.cs-pill`
- `.cs-link` — CTA button
- `.cs-screens`, `.cs-tabs`, `.cs-tab`, `.cs-tab.active`
- `.cs-frame`, `.cs-panel`, `.cs-panel.active`
- `.gif-chrome`, `.chrome-bar`, `.chrome-dots`, `.chrome-dot`, `.chrome-url`, `.chrome-body`
- `video` inside `.chrome-body` — `width: 100%; aspect-ratio: 16/10; object-fit: cover`
- `.gif-notes`, `.gif-note`, `.gif-note-lbl`, `.gif-note-body`
- Mobile breakpoint `@media (max-width: 900px)` — stack `.cs-body` to single column

---

## Step 3 — `RowDemoManager.js`: Row click → accordion

### 3a. Add instance state

```js
this.openIdx = null;
```

### 3b. Change row click delegation

```js
// BEFORE:
if (projectId) this.modalManager.open(projectId);

// AFTER:
const idx = parseInt(DOMUtils.getData(row, "projectIdx"), 10);
if (!isNaN(idx)) this.toggleCS(idx);
```

### 3c. Add `data-project-idx` to each row during render

```js
DOMUtils.setData(row, "projectIdx", String(index));
```

### 3d. Add `toggleCS(idx)` method

```js
toggleCS(idx) {
  // Close previously open accordion
  if (this.openIdx !== null && this.openIdx !== idx) {
    const prev = document.getElementById(`cs-${this.openIdx}`);
    if (prev) prev.classList.remove('open');
  }
  const el = document.getElementById(`cs-${idx}`);
  if (!el) return;
  el.classList.toggle('open');
  this.openIdx = el.classList.contains('open') ? idx : null;
  if (this.openIdx !== null) {
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }
}
```

### 3e. Add `renderCaseStudy(project, idx)` method

Builds `.cs-wrap#cs-{idx}` > `.cs-body` with:

- Left: `.cs-side` (eyebrow, h2, desc, stats, pills, `<a class="cs-link">`)
- Right: `.cs-screens` (`.cs-tabs` tab bar + `.cs-frame` with `.cs-panel` divs)
- Each panel: `.gif-chrome` (chrome bar + chrome body with `<video>`)
- Each panel: `.gif-notes` (note label + body pairs)

Wire tab clicks via event delegation on `.cs-tabs` using `switchTab(idx, tabIdx, el)`.

### 3f. Append `.cs-wrap` after each `.index-row` in `renderProjectList`

```js
const csWrap = this.renderCaseStudy(project, index);
fragment.appendChild(row);
fragment.appendChild(csWrap);
```

### 3g. Add `switchTab(projIdx, tabIdx, el)` method

```js
switchTab(projIdx, tabIdx, el) {
  const tabs = document.querySelectorAll(`#cs-${projIdx} .cs-tab`);
  tabs.forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  let i = 0;
  while (true) {
    const p = document.getElementById(`p-${projIdx}-${i}`);
    if (!p) break;
    p.classList.remove('active');
    i++;
  }
  const target = document.getElementById(`p-${projIdx}-${tabIdx}`);
  if (target) target.classList.add('active');
}
```

---

## Step 4 — `ModalManager.js`: Render case study layout inside overlay

### 4a. Replace `updateContent(project)` body

Instead of simple video/title/button stack, render the same `.cs-body` structure (sidebar + tabs) inside `.modal-content`.  
Reuse the same DOM-building logic as `renderCaseStudy` — extract it to a shared helper or duplicate it.

### 4b. Wire tab switching inside modal

After rendering, add event delegation on the modal's `.cs-tabs` element to call `switchTab`-equivalent logic scoped to the modal DOM.

---

## Step 5 — `modal.css`: Widen modal for case study layout

```css
.modal-content {
  max-width: 900px; /* was 500px */
  width: 95%;
  padding: 0; /* cs-body handles its own internal padding */
  text-align: left; /* was center */
  background: transparent;
}
```

Remove or override `.modal-image`, `.modal-video`, `.modal-title`, `.modal-client`, `.modal-service`, `.view-project-btn` sizing rules that conflict with the new layout (they are superseded by `.cs-*` rules from Step 2).

---

## File Changelist

| File                                  | Change                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| `assets/js/data.js`                   | Add `caseStudy` field to all 8 projects                                             |
| `assets/css/row.css`                  | Append accordion + case study CSS (no deletions)                                    |
| `assets/css/modal.css`                | Widen `.modal-content`, clean up superseded rules                                   |
| `assets/js/modules/RowDemoManager.js` | Add `openIdx`, `toggleCS`, `renderCaseStudy`, `switchTab`; change row click handler |
| `assets/js/modules/ModalManager.js`   | Replace `updateContent` to render full case study layout                            |
