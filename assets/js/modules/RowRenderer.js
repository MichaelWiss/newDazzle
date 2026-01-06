/**
 * Row Renderer Module
 * Handles list rendering, grid rendering, and interactions (hover, modal)
 */

const RowRenderer = (() => {

    let activeBookId = null;
    let hoveredBookId = null;

    // -- Render Helpers --
    
    const preloadImages = () => {
        Constants.BOOKS.forEach(book => {
            const img = new Image();
            img.src = book.image;
        });
    };

    const renderBookList = (container) => {
        const listContainer = DOMUtils.createElement('div', 'index-section');
        const fragment = document.createDocumentFragment();
        
        // Event Delegation for List
        DOMUtils.addEventListener(listContainer, 'click', (e) => {
            const row = DOMUtils.closest(e.target, '.index-row');
            if (row) {
                const bookId = DOMUtils.getData(row, 'bookId');
                if (bookId) openModal(bookId);
            }
        });

        DOMUtils.addEventListener(listContainer, 'mouseover', (e) => {
            const row = DOMUtils.closest(e.target, '.index-row');
            if (row) {
                const bookId = DOMUtils.getData(row, 'bookId');
                if (bookId && hoveredBookId !== bookId) {
                    hoveredBookId = bookId;
                    updateHoverImage();
                }
            }
        });

        DOMUtils.addEventListener(listContainer, 'mouseout', (e) => {
            const row = DOMUtils.closest(e.target, '.index-row');
            if (row) {
                // Only clear if we are actually leaving the row, not just moving between children
                if (!row.contains(e.relatedTarget)) {
                    hoveredBookId = null;
                    updateHoverImage();
                }
            }
        });

        Constants.BOOKS.forEach((book, index) => {
            const row = DOMUtils.createElement('div', 'index-row');
            DOMUtils.setData(row, 'bookId', book.id);

            // Columns
            // 1. Index
            const metaIndex = DOMUtils.createElement('div', 'row-meta', { text: `00-${index + 1}` });
            
            // 2. Title
            const titleCol = DOMUtils.createElement('div');
            const h1 = DOMUtils.createElement('h1', '', { text: book.title });
            DOMUtils.append(titleCol, h1);
            
            // 3. Author
            const authorCol = DOMUtils.createElement('div', 'row-meta text-right', { text: book.author });
            
            // 4. Type
            const typeCol = DOMUtils.createElement('div', 'row-meta text-right', { text: book.type });

            DOMUtils.appendChildren(row, [metaIndex, titleCol, authorCol, typeCol]);
            fragment.appendChild(row);
        });

        DOMUtils.append(listContainer, fragment);
        DOMUtils.append(container, listContainer);
    };

    const renderBookGrid = (container) => {
        // Header
        const header = DOMUtils.createElement('h2', 'grid-header', { text: 'Library Grid' });
        DOMUtils.append(container, header);

        // Grid Section
        const gridSection = DOMUtils.createElement('div', 'grid-section');
        const gridContainer = DOMUtils.createElement('div', 'grid-container');
        const fragment = document.createDocumentFragment();

        // Event Delegation for Grid
        DOMUtils.addEventListener(gridContainer, 'click', (e) => {
            const tile = DOMUtils.closest(e.target, '.grid-tile');
            if (tile) {
                const bookId = DOMUtils.getData(tile, 'bookId');
                if (bookId) openModal(bookId);
            }
        });

        Constants.BOOKS.forEach(book => {
            const tile = DOMUtils.createElement('div', 'grid-tile');
            DOMUtils.setData(tile, 'bookId', book.id);
            
            const img = DOMUtils.createElement('img', '', { 
                src: book.image, 
                alt: book.title,
                loading: 'lazy' // Lazy load images
            });
            DOMUtils.append(tile, img);
            fragment.appendChild(tile);
        });

        DOMUtils.append(gridContainer, fragment);
        DOMUtils.append(gridSection, gridContainer);
        DOMUtils.append(container, gridSection);
    };

    const renderHoverImageContainer = (parent) => {
        const container = DOMUtils.createElement('div', 'hover-image-container');
        container.id = Constants.ELEMENTS.hoverImageContainer;
        
        // Pre-create the image element
        const img = DOMUtils.createElement('img', '', { alt: 'Hover Preview' });
        DOMUtils.append(container, img);
        
        DOMUtils.append(parent, container);
    };

    const renderModal = (parent) => {
        const overlay = DOMUtils.createElement('div', 'modal-overlay');
        overlay.id = Constants.ELEMENTS.modalOverlay;
        
        // Close on overlay click
        DOMUtils.addEventListener(overlay, 'click', () => {
            closeModal();
        });

        const content = DOMUtils.createElement('div', 'modal-content');
        content.id = Constants.ELEMENTS.modalContent;

        // Stop propagation on content click
        DOMUtils.addEventListener(content, 'click', (e) => {
            e.stopPropagation();
        });

        const closeBtn = DOMUtils.createElement('div', 'close-btn', { text: 'Close' });
        DOMUtils.addEventListener(closeBtn, 'click', () => {
            closeModal();
        });

        DOMUtils.append(content, closeBtn);
        // Dynamic content will be injected here

        DOMUtils.append(overlay, content);
        DOMUtils.append(parent, overlay);
    };

    // -- State Management --

    const updateHoverImage = () => {
        const container = DOMUtils.byId(Constants.ELEMENTS.hoverImageContainer);
        if (!container) return;

        const img = container.querySelector('img');

        if (hoveredBookId) {
            const book = Constants.BOOKS.find(b => b.id === hoveredBookId);
            if (book && img) {
                if (img.src !== book.image) {
                    img.src = book.image;
                }
                DOMUtils.addClass(container, Constants.CLASSES.visible);
            }
        } else {
            DOMUtils.removeClass(container, Constants.CLASSES.visible);
        }
    };

    const openModal = (bookId) => {
        activeBookId = bookId;
        const overlay = DOMUtils.byId(Constants.ELEMENTS.modalOverlay);
        const content = DOMUtils.byId(Constants.ELEMENTS.modalContent);
        
        if (!overlay || !content) return;

        // Populate content
        // Remove everything except close button (which is first child)
        // Actually easier to rebuild content or keep close button separate.
        // Let's clear and rebuild.
        DOMUtils.clearChildren(content);

        const closeBtn = DOMUtils.createElement('div', 'close-btn', { text: 'Close' });
        DOMUtils.addEventListener(closeBtn, 'click', closeModal);
        DOMUtils.append(content, closeBtn);

        const book = Constants.BOOKS.find(b => b.id === activeBookId);
        if (book) {
            const img = DOMUtils.createElement('img', 'modal-image', { src: book.image, alt: book.title });
            const title = DOMUtils.createElement('h2', 'modal-title', { text: book.title });
            const author = DOMUtils.createElement('p', 'modal-author', { text: book.author });
            const btn = DOMUtils.createElement('button', 'borrow-btn', { text: 'Borrow Book' });

            DOMUtils.appendChildren(content, [img, title, author, btn]);
        }

        DOMUtils.addClass(overlay, Constants.CLASSES.isOpen);
    };

    const closeModal = () => {
        activeBookId = null;
        const overlay = DOMUtils.byId(Constants.ELEMENTS.modalOverlay);
        if (overlay) {
            DOMUtils.removeClass(overlay, Constants.CLASSES.isOpen);
        }
    };

    // -- Public API --

    const render = (containerId) => {
        const container = DOMUtils.byId(containerId);
        if (!container) return;

        // Preload images for instant hover
        preloadImages();

        DOMUtils.addClass(container, 'row-demo-container');
        
        // Setup wrapper
        const wrapper = DOMUtils.createElement('div', 'row-wrapper');
        
        // Floating Image Container (sibling to wrapper effectively, but can be inside)
        renderHoverImageContainer(container);
        
        // Modal (sibling to wrapper)
        renderModal(container);

        // Sections
        renderBookList(wrapper);
        renderBookGrid(wrapper);

        DOMUtils.append(container, wrapper);
    };

    return {
        render
    };
})();
