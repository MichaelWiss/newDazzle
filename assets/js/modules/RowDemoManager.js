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
    this.resumeDrawerKeydownHandler = null;
    this.resumeDrawerBackdropHandler = null;
    this.resumeDrawerCloseHandler = null;
  }

  init(containerId) {
    this.container = DOMUtils.byId(containerId);
    if (!this.container) return;

    DOMUtils.addClass(this.container, 'table-wrap');

    // Build Table Head
    const tableHead = DOMUtils.createElement("div", "table-head");
    DOMUtils.appendChildren(tableHead, [
      DOMUtils.createElement("span", "th"),
      DOMUtils.createElement("span", "th", { text: "Project" }),
      DOMUtils.createElement("span", "th", { text: "Industry" }),
      DOMUtils.createElement("span", "th", { text: "Stack" }),
    ]);
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

    const rowNum = DOMUtils.createElement("span", "row-num", {
      text: formattedIndex,
    });
    const rowTitle = DOMUtils.createElement("span", "row-title", {
      text: project.title || "",
    });
    const rowCat = DOMUtils.createElement("span", "row-cat", {
      text: project.industry || project.client || "",
    });
    const rowTech = DOMUtils.createElement("span", "row-tech", {
      text:
        project.stack ||
        project.service ||
        (project.caseStudy?.pills
          ? project.caseStudy.pills.slice(0, 2).join(", ")
          : ""),
    });

    DOMUtils.appendChildren(rowInner, [rowNum, rowTitle, rowCat, rowTech]);

    rowInner.setAttribute('role', 'button');
    rowInner.setAttribute('tabindex', '0');
    rowInner.id = `row-trigger-${index}`;
    rowInner.setAttribute("aria-controls", `cs-${index}`);
    rowInner.setAttribute("aria-expanded", "false");

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

    DOMUtils.appendChildren(side, [
      DOMUtils.createElement("div", "cs-eyebrow", { text: cs.eyebrow || "" }),
      DOMUtils.createElement("h2", "cs-title", { text: project.title || "" }),
      DOMUtils.createElement("p", "cs-desc", { text: cs.description || "" }),
    ]);

    const statsEl = DOMUtils.createElement("div", "cs-stats");
    (cs.stats || []).forEach((stat) => {
      const statEl = DOMUtils.createElement("div", "cs-stat");
      DOMUtils.appendChildren(statEl, [
        DOMUtils.createElement("span", "cs-stat-lbl", {
          text: stat.label || "",
        }),
        DOMUtils.createElement("span", "cs-stat-val", {
          text: stat.value || "",
        }),
      ]);
      DOMUtils.append(statsEl, statEl);
    });
    DOMUtils.append(side, statsEl);

    const pillsEl = DOMUtils.createElement("div", "cs-pills");
    (cs.pills || []).forEach((pill) => {
      DOMUtils.append(pillsEl, DOMUtils.createElement("span", "cs-pill", { text: pill || "" }));
    });
    DOMUtils.append(side, pillsEl);

    if (project.url) {
      const link = DOMUtils.createElement("a", "cs-link", {
        href: project.url,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "View live project →",
      });
      DOMUtils.append(side, link);
    }
    csBody.appendChild(side);

    // Screens Component
    if (cs.tabs && cs.tabs.length > 0) {
      const screens = DOMUtils.createElement("div", "cs-screens");
      
      const tabsWrap = DOMUtils.createElement("div", "cs-tabs");
      tabsWrap.id = `tabs-${projIdx}`;
      tabsWrap.setAttribute("role", "tablist");

      const frame = DOMUtils.createElement("div", "cs-frame");

      cs.tabs.forEach((tab, tabIdx) => {
        // Tab button
        const tabBtn = DOMUtils.createElement("div", "cs-tab");
        if (tabIdx === 0) tabBtn.classList.add("active");
        tabBtn.textContent = tab.label || "";
        tabBtn.setAttribute('role', 'tab');
        tabBtn.setAttribute('tabindex', tabIdx === 0 ? '0' : '-1');
        tabBtn.setAttribute("aria-selected", tabIdx === 0 ? "true" : "false");
        tabBtn.setAttribute("aria-controls", `p-${projIdx}-${tabIdx}`);
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
        panel.setAttribute("role", "tabpanel");
        panel.hidden = tabIdx !== 0;
        if (tabIdx === 0) panel.classList.add("active");

        const chrome = DOMUtils.createElement("div", "gif-chrome");
        const chromeBar = DOMUtils.createElement("div", "chrome-bar");
        const chromeDots = DOMUtils.createElement("div", "chrome-dots");
        const dotColors = ["#ff5f57", "#ffbd2e", "#28c840"];
        dotColors.forEach((color) => {
          const dot = DOMUtils.createElement("div", "chrome-dot");
          dot.style.background = color;
          DOMUtils.append(chromeDots, dot);
        });

        const chromeUrl = DOMUtils.createElement("div", "chrome-url", {
          text: tab.url || project.url || window.location.hostname,
        });
        DOMUtils.appendChildren(chromeBar, [chromeDots, chromeUrl]);

        const chromeBody = DOMUtils.createElement("div", "chrome-body");
        if (tab.media) {
          DOMUtils.append(
            chromeBody,
            DOMUtils.createElement("img", "pgif", {
              src: tab.media,
              alt: tab.label || "Project media",
              loading: "lazy",
            }),
          );
        } else if (tab.video) {
          DOMUtils.append(
            chromeBody,
            DOMUtils.createElement("video", "pgif", {
              src: tab.video,
              autoplay: "",
              loop: "",
              muted: "",
              playsinline: "",
            }),
          );
        } else {
          const pgifPh = DOMUtils.createElement("div", "pgif-ph");
          DOMUtils.append(
            pgifPh,
            DOMUtils.createElement("span", "pgif-ph-label", {
              text: tab.label || "",
            }),
          );
          DOMUtils.append(chromeBody, pgifPh);
        }

        DOMUtils.appendChildren(chrome, [chromeBar, chromeBody]);
        DOMUtils.append(panel, chrome);

        const notesWrap = DOMUtils.createElement("div", "gif-notes");
        (tab.notes || []).forEach((note) => {
          const noteEl = DOMUtils.createElement("div", "gif-note");
          DOMUtils.appendChildren(noteEl, [
            DOMUtils.createElement("div", "gif-note-lbl", {
              text: note.label || "",
            }),
            DOMUtils.createElement("div", "gif-note-body", {
              text: note.body || "",
            }),
          ]);
          DOMUtils.append(notesWrap, noteEl);
        });
        DOMUtils.append(panel, notesWrap);

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
      this.setCaseStudyExpandedState(this.openIdx, false);
    }
    
    const el = document.getElementById(`cs-${idx}`);
    if (el === null) return;
    
    el.classList.toggle('open');
    this.openIdx = el.classList.contains('open') ? idx : null;
    this.setCaseStudyExpandedState(idx, this.openIdx === idx);

    if (this.openIdx !== null) {
      setTimeout(() => el.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
    }
  }

  setCaseStudyExpandedState(idx, expanded) {
    const trigger = DOMUtils.byId(`row-trigger-${idx}`);
    if (!trigger) return;
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  switchTab(proj, tabIdx, el) {
    document.querySelectorAll(`#tabs-${proj} .cs-tab`).forEach(t => {
      t.classList.remove('active');
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });
    el.classList.add('active');
    el.setAttribute("aria-selected", "true");
    el.setAttribute("tabindex", "0");

    const screensEl = document.getElementById(`tabs-${proj}`)?.closest('.cs-screens');
    if (screensEl) {
      screensEl.querySelectorAll('.cs-panel').forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });
    }

    const target = document.getElementById(`p-${proj}-${tabIdx}`);
    if (target) {
      target.classList.add('active');
      target.hidden = false;
    }
  }

  renderGrid() {
    const grid = DOMUtils.createElement("div", "project-grid");

    SiteData.projects.forEach((project, index) => {
      const tile = DOMUtils.createElement("div", "grid-tile");
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', `View ${project.title} case study`);

      const isVideo = project.media?.endsWith('.webm') || project.media?.endsWith('.mp4');
      if (isVideo) {
        DOMUtils.append(
          tile,
          DOMUtils.createElement("video", "grid-tile-media", {
            src: project.media,
            autoplay: "",
            loop: "",
            muted: "",
            playsinline: "",
          }),
        );
      } else if (project.media) {
        DOMUtils.append(
          tile,
          DOMUtils.createElement("img", "grid-tile-media", {
            src: project.media,
            alt: project.title || "Project media",
            loading: "lazy",
          }),
        );
      } else {
        DOMUtils.append(
          tile,
          DOMUtils.createElement("div", "grid-tile-media grid-tile-ph", {
            text: project.title || "",
          }),
        );
      }

      DOMUtils.append(
        tile,
        DOMUtils.createElement("div", "grid-tile-label", {
          text: project.title || "",
        }),
      );

      const activateTile = () => {
        this.toggleCaseStudy(index);
        const row = document.getElementById(`cs-${index}`);
        if (row) setTimeout(() => row.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
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
    DOMUtils.appendChildren(rowInner, [
      DOMUtils.createElement("span", "row-num", { text: "00" }),
      DOMUtils.createElement("span", "row-title", { text: "RESUME" }),
      DOMUtils.createElement("span", "row-cat", { text: "michael.wiss@gmail.com" }),
      DOMUtils.createElement("span", "row-tech", { text: "612-434-7463" }),
    ]);
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
    this.resumeDrawerCloseHandler = () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    };
    closeBtn.addEventListener('click', this.resumeDrawerCloseHandler);

    this.resumeDrawerKeydownHandler = (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    };
    document.addEventListener('keydown', this.resumeDrawerKeydownHandler);
    
    this.resumeDrawerBackdropHandler = (e) => {
      if (e.target === drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    };
    drawer.addEventListener('click', this.resumeDrawerBackdropHandler);
  }

  destroy() {
    const drawer = document.getElementById("resume-drawer");
    const closeBtn = drawer?.querySelector(".close-drawer-btn");

    if (closeBtn && this.resumeDrawerCloseHandler) {
      closeBtn.removeEventListener("click", this.resumeDrawerCloseHandler);
    }
    if (drawer && this.resumeDrawerBackdropHandler) {
      drawer.removeEventListener("click", this.resumeDrawerBackdropHandler);
    }
    if (this.resumeDrawerKeydownHandler) {
      document.removeEventListener("keydown", this.resumeDrawerKeydownHandler);
    }

    if (this.container) this.container.innerHTML = "";

    this.resumeDrawerKeydownHandler = null;
    this.resumeDrawerBackdropHandler = null;
    this.resumeDrawerCloseHandler = null;
  }
}
