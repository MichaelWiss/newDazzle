import { SiteData } from "../data.js";

export class HoverCardManager {
  constructor() {
    this.card = document.getElementById("hoverCard");
    if (!this.card) return;

    this.hcImg = document.getElementById("hcImg");
    this.hcPh = document.getElementById("hcPh");
    this.hcVideo = document.getElementById("hcVideo");
    this.hcUrl = document.getElementById("hcUrl");
    
    this.mx = 0;
    this.my = 0;
    this.cx = 0;
    this.cy = 0;
    this.raf = null;
    this.tilts = ["-3deg", "3deg", "-4deg", "2deg"];

    this.init();
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      this.mx = e.clientX;
      this.my = e.clientY;
    });
  }

  tickCard = () => {
    this.cx += (this.mx - this.cx) * 0.1;
    this.cy += (this.my - this.cy) * 0.1;

    // Offset position to lower right of cursor
    this.card.style.left = `${this.cx + 20}px`;
    // Centered vertically relative to cursor offset
    this.card.style.top = `${this.cy - this.card.offsetHeight / 2}px`;

    this.raf = requestAnimationFrame(this.tickCard);
  };

  hoverShow(idx) {
    const p = SiteData.projects[idx];
    if (!p) return;

    this.hcUrl.textContent = p.url || p.title;
    
    // Cycle through tilt angles based on position
    const tilt = this.tilts[idx % this.tilts.length];
    this.card.style.transform = `rotate(${tilt}) scale(1)`;

    // Handle media (video vs img vs placeholder)
    if (p.media) {
      this.hcPh.style.display = "none";
      if (p.media.endsWith(".webm") || p.media.endsWith(".mp4")) {
        this.hcImg.style.display = "none";
        this.hcVideo.src = p.media;
        this.hcVideo.style.display = "block";
        this.hcVideo.play().catch(e => console.log('Video autoplay prevented', e));
      } else {
        this.hcVideo.style.display = "none";
        this.hcVideo.pause();
        this.hcImg.src = p.media;
        this.hcImg.style.display = "block";
      }
    } else {
      this.hcImg.style.display = "none";
      this.hcVideo.style.display = "none";
      this.hcPh.textContent = p.title + " — " + p.stack;
      this.hcPh.style.display = "flex";
    }

    this.card.classList.add("show");
    
    cancelAnimationFrame(this.raf);
    this.tickCard();
  }

  hoverHide() {
    this.card.classList.remove("show");
    cancelAnimationFrame(this.raf);
    this.raf = null;
    if(this.hcVideo) this.hcVideo.pause();
  }
}
