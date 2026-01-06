/**
 * RowDemoManager Class
 * Orchestrates the rendering of the list and grid views, handling user interactions.
 */
class RowDemoManager {
    constructor({ modalManager }) {
        this.modalManager = modalManager;
        this.container = null;
        this.hoverImageContainer = null;
        this.hoveredBookId = null;
        this.cleanups = [];
        
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

        // Preload images
        this.preloadImages();

        DOMUtils.addClass(this.container, 'row-demo-container');
        
        // Setup wrapper
        const wrapper = DOMUtils.createElement('div', 'row-wrapper');
        
        // Render Components
        this.renderHoverImageContainer(this.container);
        
        // If modal manager used to create modal inside this container, we should do it.
        // But the new ModalManager attaches to parent. We will pass container as parent.
        this.modalManager.init(this.container);

        this.renderBookList(wrapper);
        this.renderBookGrid(wrapper);

        DOMUtils.append(this.container, wrapper);
    }

    /**
     * Preload images for smoother hover effects
     */
    preloadImages() {
        Constants.BOOKS.forEach(book => {
            const img = new Image();
            img.src = book.image;
        });
    }

    /**
     * Render the floating hover image container
     */
    renderHoverImageContainer(parent) {
        this.hoverImageContainer = DOMUtils.createElement('div', 'hover-image-container');
        this.hoverImageContainer.id = Constants.ELEMENTS.hoverImageContainer;
        
        const img = DOMUtils.createElement('img', '', { alt: 'Hover Preview' });
        DOMUtils.append(this.hoverImageContainer, img);
        
        DOMUtils.append(parent, this.hoverImageContainer);
    }

    /**
     * Update the floating hover image based on state
     */
    updateHoverImage() {
        if (!this.hoverImageContainer) return;
        const img = this.hoverImageContainer.querySelector('img');

        if (this.hoveredBookId) {
            const book = Constants.BOOKS.find(b => b.id === this.hoveredBookId);
            if (book && img) {
                if (img.src !== book.image) {
                    img.src = book.image;
                }
                DOMUtils.addClass(this.hoverImageContainer, Constants.CLASSES.visible);
            }
        } else {
            DOMUtils.removeClass(this.hoverImageContainer, Constants.CLASSES.visible);
        }
    }

    /**
     * Render the list view of books
     */
    renderBookList(container) {
        const listContainer = DOMUtils.createElement('div', 'index-section');
        const fragment = document.createDocumentFragment();
        
        // Event Delegation
        const cleanupClick = DOMUtils.delegate(listContainer, 'click', '.index-row', (e, row) => {
            const bookId = DOMUtils.getData(row, 'bookId');
            if (bookId) this.modalManager.open(bookId);
        });
        this.cleanups.push(cleanupClick);

        const cleanupOver = DOMUtils.delegate(listContainer, 'mouseover', '.index-row', (e, row) => {
            const bookId = DOMUtils.getData(row, 'bookId');
            if (bookId && this.hoveredBookId !== bookId) {
                this.hoveredBookId = bookId;
                this.updateHoverImage();
            }
        });
        this.cleanups.push(cleanupOver);

        const cleanupOut = DOMUtils.delegate(listContainer, 'mouseout', '.index-row', (e, row) => {
             // Only clear if we are actually leaving the row, not just moving between children
             if (!row.contains(e.relatedTarget)) {
                this.hoveredBookId = null;
                this.updateHoverImage();
            }
        });
        this.cleanups.push(cleanupOut);

        // Render Rows
        Constants.BOOKS.forEach((book, index) => {
            const row = DOMUtils.createElement('div', 'index-row');
            DOMUtils.setData(row, 'bookId', book.id);

            const metaIndex = DOMUtils.createElement('div', 'row-meta', { text: `00-${index + 1}` });
            
            const titleCol = DOMUtils.createElement('div');
            const h1 = DOMUtils.createElement('h1', '', { text: book.title });
            DOMUtils.append(titleCol, h1);
            
            const authorCol = DOMUtils.createElement('div', 'row-meta text-right', { text: book.author });
            const typeCol = DOMUtils.createElement('div', 'row-meta text-right', { text: book.type });

            DOMUtils.appendChildren(row, [metaIndex, titleCol, authorCol, typeCol]);
            fragment.appendChild(row);
        });

        DOMUtils.append(listContainer, fragment);
        DOMUtils.append(container, listContainer);
    }

    /**
     * Render the grid view of books
     */
    renderBookGrid(container) {
        const header = DOMUtils.createElement('h2', 'grid-header', { text: 'Library Grid' });
        DOMUtils.append(container, header);

        const gridSection = DOMUtils.createElement('div', 'grid-section');
        const gridContainer = DOMUtils.createElement('div', 'grid-container');
        const fragment = document.createDocumentFragment();

        // Event Delegation
        const cleanupClick = DOMUtils.delegate(gridContainer, 'click', '.grid-tile', (e, tile) => {
            const bookId = DOMUtils.getData(tile, 'bookId');
            if (bookId) this.modalManager.open(bookId);
        });
        this.cleanups.push(cleanupClick);

        // Render Tiles
        Constants.BOOKS.forEach(book => {
            const tile = DOMUtils.createElement('div', 'grid-tile');
            DOMUtils.setData(tile, 'bookId', book.id);
            
            const img = DOMUtils.createElement('img', '', { 
                src: book.image, 
                alt: book.title,
                loading: 'lazy'
            });
            DOMUtils.append(tile, img);
            fragment.appendChild(tile);
        });

        DOMUtils.append(gridContainer, fragment);
        DOMUtils.append(gridSection, gridContainer);
        DOMUtils.append(container, gridSection);
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
        this.hoveredBookId = null;
    }
}
