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
        this.activeBookId = null;
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
        this.elements.img = DOMUtils.createElement('img', 'modal-image');
        this.elements.img.id = 'modal-img-el';
        
        this.elements.title = DOMUtils.createElement('h2', 'modal-title');
        this.elements.title.id = 'modal-title-el';
        
        this.elements.author = DOMUtils.createElement('p', 'modal-author');
        this.elements.author.id = 'modal-author-el';
        
        this.elements.btn = DOMUtils.createElement('button', 'borrow-btn', { text: 'Borrow Book' });

        DOMUtils.appendChildren(this.content, [
            closeBtn, 
            this.elements.img, 
            this.elements.title, 
            this.elements.author, 
            this.elements.btn
        ]);

        DOMUtils.append(this.overlay, this.content);
        DOMUtils.append(parent, this.overlay);
    }

    /**
     * Create close button with event listener
     */
    createCloseButton() {
        const btn = DOMUtils.createElement('div', 'close-btn', { text: 'Close' });
        DOMUtils.addEventListener(btn, 'click', this.close);
        return btn;
    }

    /**
     * Open modal with specific book data
     * @param {string} bookId 
     */
    open(bookId) {
        this.activeBookId = bookId;
        
        if (!this.overlay) {
            console.error('ModalManager not initialized');
            return;
        }

        const book = Constants.BOOKS.find(b => b.id === this.activeBookId);
        if (book) {
            this.updateContent(book);
            DOMUtils.addClass(this.overlay, Constants.CLASSES.isOpen);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    /**
     * Update persistent elements with new data
     */
    updateContent(book) {
        if (this.elements.img) {
            this.elements.img.src = book.image;
            this.elements.img.alt = book.title;
        }

        if (this.elements.title) {
            this.elements.title.textContent = book.title;
        }

        if (this.elements.author) {
            this.elements.author.textContent = book.author;
        }
    }

    /**
     * Close the modal
     */
    close() {
        this.activeBookId = null;
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
