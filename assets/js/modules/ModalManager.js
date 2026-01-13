/**
 * ModalManager Class
 * Handles creation, rendering, and interactions for the detail modal
 */
import { DOMUtils } from './domUtils.js';
import { Constants } from './constants.js';

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

        this.overlay = DOMUtils.createElement('div', 'modal-overlay');
        this.overlay.id = Constants.ELEMENTS.modalOverlay;
        
        // Close on overlay click
        DOMUtils.addEventListener(this.overlay, 'click', () => {
            this.close();
        });

        this.content = DOMUtils.createElement('div', 'modal-content');
        this.content.id = Constants.ELEMENTS.modalContent;

        // Stop propagation on content click
        DOMUtils.addEventListener(this.content, 'click', (e) => {
            e.stopPropagation();
        });

        const closeBtn = this.createCloseButton();
        
        // Persistent Content Elements (initially hidden or empty)
        // Persistent Content Elements (initially hidden or empty)
        this.elements.mediaContainer = DOMUtils.createElement('div', 'modal-media-container');

        this.elements.img = DOMUtils.createElement('img', 'modal-image');
        this.elements.img.id = 'modal-img-el';
        this.elements.img.style.display = 'none'; // Default hidden

        this.elements.video = DOMUtils.createElement('video', 'modal-video', {
            muted: '',
            loop: '',
            autoplay: '',
            playsinline: '',
            controls: ''
        });
        this.elements.video.id = 'modal-video-el';
        this.elements.video.style.display = 'none'; // Default hidden
        
        DOMUtils.appendChildren(this.elements.mediaContainer, [this.elements.img, this.elements.video]);

        this.elements.title = DOMUtils.createElement('h2', 'modal-title');
        this.elements.title.id = 'modal-title-el';
        
        this.elements.client = DOMUtils.createElement('p', 'modal-client');
        this.elements.client.id = 'modal-client-el';
        
        this.elements.service = DOMUtils.createElement('p', 'modal-service');
        this.elements.service.id = 'modal-service-el';
        
        this.elements.btn = DOMUtils.createElement('button', 'view-project-btn', { text: 'View Project' });

        DOMUtils.appendChildren(this.content, [
            this.elements.mediaContainer, 
            this.elements.title, 
            this.elements.client, 
            this.elements.service,
            this.elements.btn
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
        const btn = DOMUtils.createElement('div', 'close-btn', { text: 'Close' });
        DOMUtils.addEventListener(btn, 'click', (e) => {
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
            console.error('ModalManager not initialized');
            return;
        }

        const project = Constants.PROJECTS.find(p => p.id === this.activeProjectId);
        if (project) {
            this.updateContent(project);
            DOMUtils.addClass(this.overlay, Constants.CLASSES.isOpen);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    /**
     * Update persistent elements with new data
     */
    updateContent(project) {
        const isVideo = project.media.endsWith('.webm') || project.media.endsWith('.mp4');

        if (isVideo) {
            this.elements.video.src = project.media;
            this.elements.video.style.display = 'block';
            this.elements.video.play().catch(e => console.warn('Modal video play blocked', e));
            
            this.elements.img.style.display = 'none';
        } else {
            this.elements.img.src = project.media;
            this.elements.img.alt = project.title;
            this.elements.img.style.display = 'block';
            
            this.elements.video.style.display = 'none';
            this.elements.video.pause();
        }

        if (this.elements.title) {
            this.elements.title.textContent = project.title;
        }

        if (this.elements.client) {
            this.elements.client.textContent = project.client;
        }
        
        if (this.elements.service) {
            this.elements.service.textContent = project.service;
        }
        
        // Handle button URL
        if (this.elements.btn) {
            // Remove any existing click handlers
            const newBtn = this.elements.btn.cloneNode(true);
            this.elements.btn.parentNode.replaceChild(newBtn, this.elements.btn);
            this.elements.btn = newBtn;
            
            if (project.url) {
                this.elements.btn.style.display = 'block';
                this.elements.btn.style.cursor = 'pointer';
                this.elements.btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(project.url, '_blank', 'noopener,noreferrer');
                });
            } else {
                this.elements.btn.style.display = 'none';
            }
        }
    }

    /**
     * Close the modal
     */
    close() {
        this.activeProjectId = null;
        if (this.overlay) {
            DOMUtils.removeClass(this.overlay, Constants.CLASSES.isOpen);
            document.body.style.overflow = ''; // Restore scrolling
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
