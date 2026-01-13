/**
 * RowDemoManager Class
 * Orchestrates the rendering of the list and grid views, handling user interactions.
 */
import { DOMUtils } from './domUtils.js';
import { Constants } from './constants.js';
import { ResumeRenderer } from './ResumeRenderer.js';

export class RowDemoManager {
    constructor({ modalManager }) {
        this.modalManager = modalManager;
        this.container = null;
        this.hoverImageContainer = null;
        this.hoveredProjectId = null;
        this.cleanups = [];
        
        // Array of rotation angles for variety
        this.rotationAngles = [-8, -5, -2, 3, 6, -6, 2, -4, 5, -3];
        
        // Bind methods
        this.updateHoverImage = this.updateHoverImage.bind(this);
    }

    /**
     * Initialize the Row Demo
     * @param {string} containerId - The ID of the container element
     */
    init(containerId) {
        this.container = DOMUtils.byId(containerId);
        if (!this.container) return;

        // Note: Image preloading removed to support heavy assets (GIFs)
        // Images will now lazy-load only when the user hovers over a row.

        DOMUtils.addClass(this.container, 'row-demo-container');
        
        // Setup wrapper
        const wrapper = DOMUtils.createElement('div', 'row-wrapper');
        
        // Render Components
        this.renderHoverImageContainer(this.container);
        
        // ModalManager is now initialized in main.js and attached to body

        this.renderProjectList(wrapper);
        this.renderProjectGrid(wrapper);
        this.renderFooter(wrapper);
        this.renderResumeDrawer(); // Inject the drawer markup

        DOMUtils.append(this.container, wrapper);
    }

    /**
     * Render the floating hover image container
     */
    renderHoverImageContainer(parent) {
        this.hoverImageContainer = DOMUtils.createElement('div', 'hover-image-container');
        this.hoverImageContainer.id = Constants.ELEMENTS.hoverImageContainer;
        
        const img = DOMUtils.createElement('img', '', { alt: 'Hover Preview' });
        img.style.display = 'none'; // Default hidden
        DOMUtils.append(this.hoverImageContainer, img);

        const video = DOMUtils.createElement('video', '', {
            muted: '',
            loop: '',
            autoplay: '',
            playsinline: ''
        });
        video.muted = true; // Ensure property is set for autoplay policy
        video.style.display = 'none'; // Default hidden
        DOMUtils.append(this.hoverImageContainer, video);
        
        DOMUtils.append(parent, this.hoverImageContainer);
    }

    /**
     * Update the floating hover image based on state
     */
    updateHoverImage() {
        if (!this.hoverImageContainer) return;
        const img = this.hoverImageContainer.querySelector('img');
        const video = this.hoverImageContainer.querySelector('video');

        if (this.hoveredProjectId) {
            const project = Constants.PROJECTS.find(p => p.id === this.hoveredProjectId);
            if (project) {
                const isVideo = project.media.endsWith('.webm') || project.media.endsWith('.mp4');

                if (isVideo && video) {
                    if (!video.src.includes(project.media)) { // Simple check to avoid reloading
                        video.src = project.media;
                        video.load();
                        video.play().catch(e => console.warn('Video autoplay blocked', e));
                    }
                    if (img) img.style.display = 'none';
                    video.style.display = 'block';
                } else if (img) {
                    if (img.src !== project.media) {
                        img.src = project.media;
                    }
                    if (video) {
                        video.style.display = 'none';
                        video.pause();
                    }
                    img.style.display = 'block';
                }

                // Get project index and apply rotation angle
                const projectIndex = Constants.PROJECTS.findIndex(p => p.id === this.hoveredProjectId);
                const rotationAngle = this.rotationAngles[projectIndex % this.rotationAngles.length];
                this.hoverImageContainer.style.setProperty('--hover-rotation', `${rotationAngle}deg`);

                DOMUtils.addClass(this.hoverImageContainer, Constants.CLASSES.visible);
            }
        } else {
            DOMUtils.removeClass(this.hoverImageContainer, Constants.CLASSES.visible);
            if (video) video.pause();
        }
    }

    /**
     * Render the list view of projects
     */
    renderProjectList(container) {
        const listContainer = DOMUtils.createElement('div', 'index-section');
        const fragment = document.createDocumentFragment();
        
        // Event Delegation
        const cleanupClick = DOMUtils.delegate(listContainer, 'click', '.index-row', (e, row) => {
            const projectId = DOMUtils.getData(row, 'projectId');
            if (projectId) this.modalManager.open(projectId);
        });
        this.cleanups.push(cleanupClick);

        const cleanupOver = DOMUtils.delegate(listContainer, 'mouseover', '.index-row', (e, row) => {
            const projectId = DOMUtils.getData(row, 'projectId');
            if (projectId && this.hoveredProjectId !== projectId) {
                this.hoveredProjectId = projectId;
                this.updateHoverImage();
            }
        });
        this.cleanups.push(cleanupOver);

        const cleanupOut = DOMUtils.delegate(listContainer, 'mouseout', '.index-row', (e, row) => {
             // Only clear if we are actually leaving the row, not just moving between children
             if (!row.contains(e.relatedTarget)) {
                this.hoveredProjectId = null;
                this.updateHoverImage();
            }
        });
        this.cleanups.push(cleanupOut);

        // Render Rows
        Constants.PROJECTS.forEach((project, index) => {
            const row = DOMUtils.createElement('div', 'index-row');
            DOMUtils.setData(row, 'projectId', project.id);

            const metaIndex = DOMUtils.createElement('div', 'row-meta', { text: `00-${index + 1}` });
            
            const titleCol = DOMUtils.createElement('div');
            const h1 = DOMUtils.createElement('h1', '', { text: project.title });
            DOMUtils.append(titleCol, h1);
            
            const clientCol = DOMUtils.createElement('div', 'row-meta text-right', { text: project.client });
            const serviceCol = DOMUtils.createElement('div', 'row-meta text-right', { text: project.service });

            DOMUtils.appendChildren(row, [metaIndex, titleCol, clientCol, serviceCol]);
            fragment.appendChild(row);
        });

        DOMUtils.append(listContainer, fragment);
        DOMUtils.append(container, listContainer);
    }

    /**
     * Render the grid view of projects
     */
    renderProjectGrid(container) {
        const header = DOMUtils.createElement('h2', 'grid-header', { text: 'Selected Works' });
        DOMUtils.append(container, header);

        const gridSection = DOMUtils.createElement('div', 'grid-section');
        const gridContainer = DOMUtils.createElement('div', 'grid-container');
        const fragment = document.createDocumentFragment();

        // Event Delegation
        const cleanupClick = DOMUtils.delegate(gridContainer, 'click', '.grid-tile', (e, tile) => {
            const projectId = DOMUtils.getData(tile, 'projectId');
            if (projectId) this.modalManager.open(projectId);
        });
        this.cleanups.push(cleanupClick);

        // Render Tiles
        Constants.PROJECTS.forEach(project => {
            const tile = DOMUtils.createElement('div', 'grid-tile');
            DOMUtils.setData(tile, 'projectId', project.id);
            
            const isVideo = project.media.endsWith('.webm') || project.media.endsWith('.mp4');

            if (isVideo) {
                const video = DOMUtils.createElement('video', '', { 
                    src: project.media, 
                    muted: '',
                    loop: '',
                    autoplay: '',
                    playsinline: ''
                });
                video.muted = true; // Ensure property is set
                DOMUtils.append(tile, video);
            } else {
                const img = DOMUtils.createElement('img', '', { 
                    src: project.media, 
                    alt: project.title,
                    loading: 'lazy'
                });
                DOMUtils.append(tile, img);
            }
            fragment.appendChild(tile);
        });

        DOMUtils.append(gridContainer, fragment);
        DOMUtils.append(gridSection, gridContainer);
        DOMUtils.append(container, gridSection);
    }

    /**
     * Render the footer with Resume link
     */
    renderFooter(container) {
        // Create footer row matching .index-row structure
        const footerRow = DOMUtils.createElement('div', 'index-row');
        footerRow.id = 'footer-row';
        footerRow.style.borderBottom = 'none'; // Footer specific style
        footerRow.style.marginTop = '40px'; // Spacing
        footerRow.style.cursor = 'pointer';

        const metaIndex = DOMUtils.createElement('div', 'row-meta', { text: '00' });
        
        const titleCol = DOMUtils.createElement('div');
        const h1 = DOMUtils.createElement('h1', '', { text: 'RESUME' });
        DOMUtils.append(titleCol, h1);
        
        const emailCol = DOMUtils.createElement('div', 'row-meta text-right', { text: 'michael.wiss@gmail.com' });
        const phoneCol = DOMUtils.createElement('div', 'row-meta text-right', { text: '612-434-7463' });

        DOMUtils.appendChildren(footerRow, [metaIndex, titleCol, emailCol, phoneCol]);
        
        // Click handler to open drawer
        footerRow.addEventListener('click', () => {
            const drawer = document.getElementById('resume-drawer');
            if (drawer) {
                drawer.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        DOMUtils.append(container, footerRow);
    }

    /**
     * Render the Resume Drawer markup into the body
     */
    renderResumeDrawer() {
        if (document.getElementById('resume-drawer')) return; // Prevent duplicates

        const drawer = DOMUtils.createElement('div');
        drawer.id = 'resume-drawer';
        
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

        // Render Dynamic Resume
        const scrollContainer = drawer.querySelector('#resume-container-scrollable');
        ResumeRenderer.render(scrollContainer, Constants.RESUME_DATA);

        // Append to body so it overlays everything
        document.body.appendChild(drawer);

        // Bind events for this drawer
        const closeBtn = drawer.querySelector('.close-drawer-btn');
        closeBtn.addEventListener('click', () => {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                drawer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on click outside (backdrop)
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) {
                drawer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Cleanup resources and listeners
     */
    destroy() {
        this.cleanups.forEach(fn => fn());
        this.cleanups = [];
        this.modalManager.destroy();
        
        if (this.container) {
            DOMUtils.clearChildren(this.container);
        }
        
        this.container = null;
        this.hoverImageContainer = null;
        this.hoveredProjectId = null;
    }
}
