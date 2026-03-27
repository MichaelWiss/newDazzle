/**
 * ModalManager Class
 * Handles creation, rendering, and interactions for the detail modal
 */
import { DOMUtils } from "./domUtils.js";
import { Constants } from "./constants.js";

export class ModalManager {
  constructor() {
    this.overlay = null;
    this.content = null;
    this.activeProjectId = null;
    this.elements = {};

    // Bind methods
    this.close = this.close.bind(this);
  }

  /**
   * Initialize modal elements and append to parent
   * @param {HTMLElement} parent - Container element
   */
  init(parent) {
    if (this.overlay) return; // Already initialized

    this.overlay = DOMUtils.createElement("div", "modal-overlay");
    this.overlay.id = Constants.ELEMENTS.modalOverlay;
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-labelledby', 'modal-title-el');

    // Close on overlay click
    DOMUtils.addEventListener(this.overlay, "click", () => {
      this.close();
    });

    this.content = DOMUtils.createElement("div", "modal-content");
    this.content.id = Constants.ELEMENTS.modalContent;

    // Stop propagation on content click
    DOMUtils.addEventListener(this.content, "click", (e) => {
      e.stopPropagation();
    });

    const closeBtn = this.createCloseButton();

    // Persistent Content Elements (initially hidden or empty)
    // Persistent Content Elements (initially hidden or empty)
    this.elements.mediaContainer = DOMUtils.createElement(
      "div",
      "modal-media-container",
    );

    this.elements.img = DOMUtils.createElement("img", "modal-image");
    this.elements.img.id = "modal-img-el";
    this.elements.img.style.display = "none"; // Default hidden

    this.elements.video = DOMUtils.createElement("video", "modal-video", {
      muted: "",
      loop: "",
      autoplay: "",
      playsinline: "",
      controls: "",
    });
    this.elements.video.id = "modal-video-el";
    this.elements.video.style.display = "none"; // Default hidden

    DOMUtils.appendChildren(this.elements.mediaContainer, [
      this.elements.img,
      this.elements.video,
    ]);

    this.elements.title = DOMUtils.createElement("h2", "modal-title");
    this.elements.title.id = "modal-title-el";

    this.elements.client = DOMUtils.createElement("p", "modal-client");
    this.elements.client.id = "modal-client-el";

    this.elements.service = DOMUtils.createElement("p", "modal-service");
    this.elements.service.id = "modal-service-el";

    this.elements.btn = DOMUtils.createElement("button", "view-project-btn", {
      text: "View Project",
    });

    DOMUtils.appendChildren(this.content, [
      this.elements.mediaContainer,
      this.elements.title,
      this.elements.client,
      this.elements.service,
      this.elements.btn,
    ]);

    // Append close button and content to overlay
    DOMUtils.append(this.overlay, closeBtn);
    DOMUtils.append(this.overlay, this.content);
    DOMUtils.append(parent, this.overlay);
  }

  /**
   * Create close button with event listener
   */
  createCloseButton() {
    const btn = DOMUtils.createElement("div", "close-btn", { text: "Close" });
    DOMUtils.addEventListener(btn, "click", (e) => {
      e.stopPropagation();
      this.close();
    });
    return btn;
  }

  /**
   * Open modal with specific project data
   * @param {string} projectId
   */
  open(projectId) {
    this.activeProjectId = projectId;

    if (!this.overlay) {
      console.error("ModalManager not initialized");
      return;
    }

    const project = Constants.PROJECTS.find(
      (p) => p.id === this.activeProjectId,
    );
    if (project) {
      this.updateContent(project);
      DOMUtils.addClass(this.overlay, Constants.CLASSES.isOpen);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  }

  /**
   * Update modal with full case study layout
   */
  updateContent(project) {
    // Clear previous content
    DOMUtils.clearChildren(this.content);

    const cs = project.caseStudy;

    // Fallback for projects without caseStudy data
    if (!cs) {
      const title = DOMUtils.createElement("h2", "modal-title", {
        text: project.title,
      });
      const btn = DOMUtils.createElement("button", "view-project-btn", {
        text: "View Project",
      });
      if (project.url && project.url !== "#") {
        btn.addEventListener("click", () =>
          window.open(project.url, "_blank", "noopener,noreferrer"),
        );
      }
      DOMUtils.appendChildren(this.content, [title, btn]);
      return;
    }

    const body = DOMUtils.createElement("div", "cs-body");

    // ── Sidebar ──────────────────────────────────────
    const side = DOMUtils.createElement("aside", "cs-side");
    const eyebrow = DOMUtils.createElement("div", "cs-eyebrow", {
      text: cs.eyebrow,
    });
    const title = DOMUtils.createElement("h2", "cs-title", {
      text: project.title,
    });
    const desc = DOMUtils.createElement("p", "cs-desc", {
      text: cs.description,
    });
    DOMUtils.appendChildren(side, [eyebrow, title, desc]);

    if (cs.stats && cs.stats.length) {
      const statsEl = DOMUtils.createElement("div", "cs-stats");
      cs.stats.forEach((stat) => {
        const statEl = DOMUtils.createElement("div", "cs-stat");
        const lbl = DOMUtils.createElement("span", "cs-stat-lbl", {
          text: stat.label,
        });
        const val = DOMUtils.createElement("span", "cs-stat-val", {
          text: stat.value,
        });
        DOMUtils.appendChildren(statEl, [lbl, val]);
        DOMUtils.append(statsEl, statEl);
      });
      DOMUtils.append(side, statsEl);
    }

    if (cs.pills && cs.pills.length) {
      const pillsEl = DOMUtils.createElement("div", "cs-pills");
      cs.pills.forEach((pill) =>
        DOMUtils.append(
          pillsEl,
          DOMUtils.createElement("span", "cs-pill", { text: pill }),
        ),
      );
      DOMUtils.append(side, pillsEl);
    }

    const link = DOMUtils.createElement("a", "cs-link", {
      href: project.url,
      text: "View live project →",
      target: "_blank",
      rel: "noreferrer noopener",
    });
    DOMUtils.append(side, link);

    // ── Screens ──────────────────────────────────────
    const screens = DOMUtils.createElement("div", "cs-screens");
    const tabBar = DOMUtils.createElement("div", "cs-tabs");
    tabBar.id = "modal-tabs";
    const frame = DOMUtils.createElement("div", "cs-frame");

    (cs.tabs || []).forEach((tab, tabIdx) => {
      const tabEl = DOMUtils.createElement(
        "div",
        tabIdx === 0 ? "cs-tab active" : "cs-tab",
        { text: tab.label },
      );
      tabEl.addEventListener("click", () => {
        document
          .querySelectorAll("#modal-tabs .cs-tab")
          .forEach((t) => t.classList.remove("active"));
        tabEl.classList.add("active");
        let i = 0;
        while (true) {
          const p = document.getElementById(`modal-p-${i}`);
          if (!p) break;
          p.classList.remove("active");
          i++;
        }
        const target = document.getElementById(`modal-p-${tabIdx}`);
        if (target) target.classList.add("active");
      });
      DOMUtils.append(tabBar, tabEl);

      const panel = DOMUtils.createElement(
        "div",
        tabIdx === 0 ? "cs-panel active" : "cs-panel",
      );
      panel.id = `modal-p-${tabIdx}`;

      // Browser chrome
      const chrome = DOMUtils.createElement("div", "gif-chrome");
      const bar = DOMUtils.createElement("div", "chrome-bar");
      const dots = DOMUtils.createElement("div", "chrome-dots");
      [
        { color: "#ff5f57" },
        { color: "#ffbd2e" },
        { color: "#28c840" },
      ].forEach((d) => {
        const dot = DOMUtils.createElement("div", "chrome-dot");
        dot.style.background = d.color;
        DOMUtils.append(dots, dot);
      });
      const urlEl = DOMUtils.createElement("div", "chrome-url", {
        text: tab.url,
      });
      DOMUtils.appendChildren(bar, [dots, urlEl]);

      const chromeBody = DOMUtils.createElement("div", "chrome-body");
      const isVideo =
        project.media &&
        (project.media.endsWith(".webm") || project.media.endsWith(".mp4"));
      if (isVideo) {
        const video = DOMUtils.createElement("video", "cs-video", {
          src: project.media,
          muted: "",
          loop: "",
          autoplay: "",
          playsinline: "",
        });
        video.muted = true;
        video.play().catch(() => {});
        DOMUtils.append(chromeBody, video);
      }
      DOMUtils.appendChildren(chrome, [bar, chromeBody]);
      DOMUtils.append(panel, chrome);

      if (tab.notes && tab.notes.length) {
        const notesEl = DOMUtils.createElement("div", "gif-notes");
        tab.notes.forEach((note) => {
          const noteEl = DOMUtils.createElement("div", "gif-note");
          const lblEl = DOMUtils.createElement("div", "gif-note-lbl", {
            text: note.label,
          });
          const bodyEl = DOMUtils.createElement("div", "gif-note-body", {
            text: note.body,
          });
          DOMUtils.appendChildren(noteEl, [lblEl, bodyEl]);
          DOMUtils.append(notesEl, noteEl);
        });
        DOMUtils.append(panel, notesEl);
      }

      DOMUtils.append(frame, panel);
    });

    DOMUtils.appendChildren(screens, [tabBar, frame]);
    DOMUtils.appendChildren(body, [side, screens]);
    DOMUtils.append(this.content, body);
  }

  /**
   * Close the modal
   */
  close() {
    this.activeProjectId = null;
    if (this.overlay) {
      // Pause any videos before hiding
      this.content.querySelectorAll("video").forEach((v) => v.pause());
      DOMUtils.removeClass(this.overlay, Constants.CLASSES.isOpen);
      document.body.style.overflow = ""; // Restore scrolling
    }
  }

  /**
   * Remove elements and listeners
   */
  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.content = null;
    this.elements = {};
  }
}
