import { DOMUtils } from "./domUtils.js";
import { Constants } from "./constants.js";
import { ResumeRenderer } from "./ResumeRenderer.js";
import { SiteData } from "../data.js";

export class RowDemoManager {
  constructor({ modalManager, hoverCardManager }) {
    this.modalManager = modalManager;
    this.hoverCardManager = hoverCardManager;
    this.container = null;
    this.openIdx = null;
  }

  init(containerId) {
    this.container = DOMUtils.byId(containerId);
    if (!this.container) return;

    DOMUtils.addClass(this.container, 'table-wrap');

    // Build Table Head
    const tableHead = DOMUtils.createElement("div", "table-head");
    tableHead.innerHTML = `
      <span class="th"></span>
      <span class="th">Project</span>
      <span class="th">Industry</span>
      <span class="th">Stack</span>
    `;
    this.container.appendChild(tableHead);

    // Build Rows
    SiteData.projects.forEach((project, index) => {
      this.renderProjectRow(project, index);
    });

    // Project thumbnail grid
    this.renderGrid();

    // Footer row + Resume drawer
    this.renderFooter();
    this.renderResumeDrawer();
  }

  renderProjectRow(project, index) {
    const row = DOMUtils.createElement("div", "project-row");

    // Inner Row (Trigger)
    const rowInner = DOMUtils.createElement("div", "row-inner");
    const formattedIndex = index < 9 ? `00-${index + 1}` : `0${index + 1}`;
    
    rowInner.innerHTML = `
      <span class="row-num">${formattedIndex}</span>
      <span class="row-title">${project.title}</span>
      <span class="row-cat">${project.industry || project.client || ''}</span>
      <span class="row-tech">${project.stack || project.service || (project.caseStudy?.pills ? project.caseStudy.pills.slice(0,2).join(', ') : '')}</span>
    `;

    rowInner.setAttribute('role', 'button');
    rowInner.setAttribute('tabindex', '0');

    // Events for toggle and hover card
    rowInner.addEventListener("mouseenter", () => {
      if(this.hoverCardManager) this.hoverCardManager.hoverShow(index);
    });
    rowInner.addEventListener("mouseleave", () => {
      if(this.hoverCardManager) this.hoverCardManager.hoverHide();
    });
    rowInner.addEventListener("click", () => this.toggleCaseStudy(index));
    rowInner.addEventListener("keydown", (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleCaseStudy(index);
      }
    });

    row.appendChild(rowInner);

    // Case Study Dropdown
    const csWrap = DOMUtils.createElement("div", "cs-wrap");
    csWrap.id = `cs-${index}`;

    if (project.caseStudy) {
      this.buildCaseStudyContent(csWrap, project, index);
    }
    
    row.appendChild(csWrap);
    this.container.appendChild(row);
  }

  buildCaseStudyContent(wrap, project, projIdx) {
    const csBody = DOMUtils.createElement("div", "cs-body");
    const cs = project.caseStudy;

    // Sidebar
    const side = DOMUtils.createElement("aside", "cs-side");
    let statsHtml = cs.stats?.map(s => `<div class="cs-stat"><span class="cs-stat-lbl">${s.label}</span><span class="cs-stat-val">${s.value}</span></div>`).join('') || '';
    let pillsHtml = cs.pills?.map(p => `<span class="cs-pill">${p}</span>`).join('') || '';

    side.innerHTML = `
      <div class="cs-eyebrow">${cs.eyebrow || ''}</div>
      <h2 class="cs-title">${project.title}</h2>
      <p class="cs-desc">${cs.description || ''}</p>
      <div class="cs-stats">${statsHtml}</div>
      <div class="cs-pills">${pillsHtml}</div>
      ${project.url ? `<a href="${project.url}" target="_blank" class="cs-link">View live project →</a>` : ''}
    `;
    csBody.appendChild(side);

    // Screens Component
    if (cs.tabs && cs.tabs.length > 0) {
      const screens = DOMUtils.createElement("div", "cs-screens");
      
      const tabsWrap = DOMUtils.createElement("div", "cs-tabs");
      tabsWrap.id = `tabs-${projIdx}`;

      const frame = DOMUtils.createElement("div", "cs-frame");

      cs.tabs.forEach((tab, tabIdx) => {
        // Tab button
        const tabBtn = DOMUtils.createElement("div", "cs-tab");
        if (tabIdx === 0) tabBtn.classList.add("active");
        tabBtn.textContent = tab.label;
        tabBtn.setAttribute('role', 'tab');
        tabBtn.setAttribute('tabindex', tabIdx === 0 ? '0' : '-1');
        tabBtn.addEventListener("click", (e) => this.switchTab(projIdx, tabIdx, e.currentTarget));
        tabBtn.addEventListener("keydown", (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.switchTab(projIdx, tabIdx, e.currentTarget);
          }
        });
        tabsWrap.appendChild(tabBtn);

        // Panel content
        const panel = DOMUtils.createElement("div", "cs-panel");
        panel.id = `p-${projIdx}-${tabIdx}`;
        if (tabIdx === 0) panel.classList.add("active");

        let notesHtml = tab.notes?.map(n => `<div class="gif-note"><div class="gif-note-lbl">${n.label}</div><div class="gif-note-body">${n.body}</div></div>`).join('') || '';
        
        let visualHtml = '';
        if (tab.media) {
            visualHtml = `<img class="pgif" src="${tab.media}" alt="${tab.label}">`;
        } else if (tab.video) {
            visualHtml = `<video class="pgif" src="${tab.video}" autoplay loop muted playsinline></video>`;
        } else {
            visualHtml = `<div class="pgif-ph"><span class="pgif-ph-label">${tab.label}</span></div>`;
        }

        panel.innerHTML = `
          <div class="gif-chrome">
            <div class="chrome-bar">
              <div class="chrome-dots"><div class="chrome-dot" style="background:#ff5f57"></div><div class="chrome-dot" style="background:#ffbd2e"></div><div class="chrome-dot" style="background:#28c840"></div></div>
              <div class="chrome-url">${tab.url || project.url || window.location.hostname}</div>
            </div>
            <div class="chrome-body">
              ${visualHtml}
            </div>
          </div>
          <div class="gif-notes">${notesHtml}</div>
        `;
        frame.appendChild(panel);
      });

      screens.appendChild(tabsWrap);
      screens.appendChild(frame);
      csBody.appendChild(screens);
    }

    wrap.appendChild(csBody);
  }

  toggleCaseStudy(idx) {
    if (this.openIdx !== null && this.openIdx !== idx) {
      const openEl = document.getElementById(`cs-${this.openIdx}`);
      if (openEl) openEl.classList.remove('open');
    }
    
    const el = document.getElementById(`cs-${idx}`);
    if (el === null) return;
    
    el.classList.toggle('open');
    this.openIdx = el.classList.contains('open') ? idx : null;

    if (this.openIdx !== null) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  }

  switchTab(proj, tabIdx, el) {
    document.querySelectorAll(`#tabs-${proj} .cs-tab`).forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    const screensEl = document.getElementById(`tabs-${proj}`)?.closest('.cs-screens');
    if (screensEl) screensEl.querySelectorAll('.cs-panel').forEach(p => p.classList.remove('active'));

    const target = document.getElementById(`p-${proj}-${tabIdx}`);
    if (target) target.classList.add('active');
  }

  renderGrid() {
    const grid = DOMUtils.createElement("div", "project-grid");

    SiteData.projects.forEach((project, index) => {
      const tile = DOMUtils.createElement("div", "grid-tile");
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', `View ${project.title} case study`);

      const isVideo = project.media?.endsWith('.webm') || project.media?.endsWith('.mp4');
      let mediaHtml;
      if (isVideo) {
        mediaHtml = `<video class="grid-tile-media" src="${project.media}" autoplay loop muted playsinline></video>`;
      } else if (project.media) {
        mediaHtml = `<img class="grid-tile-media" src="${project.media}" alt="${project.title}" loading="lazy">`;
      } else {
        mediaHtml = `<div class="grid-tile-media grid-tile-ph">${project.title}</div>`;
      }

      tile.innerHTML = `
        ${mediaHtml}
        <div class="grid-tile-label">${project.title}</div>
      `;

      const activateTile = () => {
        this.toggleCaseStudy(index);
        const row = document.getElementById(`cs-${index}`);
        if (row) setTimeout(() => row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
      };

      tile.addEventListener("click", activateTile);
      tile.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTile();
        }
      });

      grid.appendChild(tile);
    });

    this.container.appendChild(grid);
  }

  renderFooter() {
    const footerRow = DOMUtils.createElement('div', 'project-row');
    footerRow.id = 'footer-row';
    footerRow.style.borderBottom = 'none';
    footerRow.style.marginTop = '40px';
    footerRow.style.cursor = 'pointer';

    const rowInner = DOMUtils.createElement('div', 'row-inner');
    rowInner.innerHTML = `
      <span class="row-num">00</span>
      <span class="row-title">RESUME</span>
      <span class="row-cat">michael.wiss@gmail.com</span>
      <span class="row-tech">612-434-7463</span>
    `;
    rowInner.setAttribute('role', 'button');
    rowInner.setAttribute('tabindex', '0');

    const openDrawer = () => {
      const drawer = document.getElementById('resume-drawer');
      if (drawer) {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    rowInner.addEventListener('click', openDrawer);
    rowInner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDrawer();
      }
    });

    footerRow.appendChild(rowInner);
    this.container.appendChild(footerRow);
  }

  renderResumeDrawer() {
    if (document.getElementById('resume-drawer')) return;

    const drawer = DOMUtils.createElement('div');
    drawer.id = 'resume-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Resume');
    
    drawer.innerHTML = `
      <div class="drawer-content">
        <div class="drawer-header">
          <button class="drawer-btn close-drawer-btn">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
        <div id="resume-container-scrollable" style="flex: 1; overflow-y: auto;"></div>
      </div>
    `;

    const scrollContainer = drawer.querySelector('#resume-container-scrollable');
    ResumeRenderer.render(scrollContainer, Constants.RESUME_DATA);

    document.body.appendChild(drawer);

    const closeBtn = drawer.querySelector('.close-drawer-btn');
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  destroy() {
    if (this.container) this.container.innerHTML = "";
  }
}
