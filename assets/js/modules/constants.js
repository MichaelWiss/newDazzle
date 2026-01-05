/**
 * Constants Module
 * Configuration and data for Dazzle Row Demo
 */

const Constants = (() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const BOOKS = [
        { 
            id: 'azurest-blue', 
            title: 'AZUREST BLUE: The Life and Legacy of Amaza Lee Meredith', 
            author: 'Saint Heron', 
            type: 'Research Journal',
            image: 'https://saintheron.com/cdn/shop/files/ALM-SCANS-COVER-2_600x.jpg?v=1762822932' 
        },
        { 
            id: 'daughters-geography', 
            title: "A Daughter's Geography", 
            author: 'Ntozake Shange', 
            type: 'Poetry',
            image: 'https://saintheron.com/cdn/shop/files/A_Daughter_s_Geography_600x.jpg?v=1758819678' 
        },
        { 
            id: 'black-dance', 
            title: 'Black Dance', 
            author: 'Edward Thorpe', 
            type: 'Arts & Photography',
            image: 'https://saintheron.com/cdn/shop/files/COVER_BLACKDANCE_600x.png?v=1698690934' 
        },
        { 
            id: 'american-negro-art', 
            title: 'American Negro Art', 
            author: 'Cedric Dover', 
            type: 'Art Catalogue',
            image: 'https://saintheron.com/cdn/shop/products/American-Negro-Art-001_600x.png?v=1634054597' 
        }
    ];

    const DAZZLE_TEXT = `Dazzle is a creative studio in New York City that makes everything DAZZLING. We make work across all mediums and platforms: branding, digital, motion, illustration, environmental, print, packaging & more.`;

    const DAZZLE_COLORS = [
        '#ff5ca8', // Hot Pink
        '#ffbd2e', // Marigold
        '#2bf65d', // Neon Green
        '#05d5ff', // Cyan
        '#a855f7', // Purple
        '#ff5ca8'  // Loop back to Pink
    ];

    const ELEMENTS = {
        dazzleHeader: 'dazzleHeader',
        bookList: 'bookList',
        bookGrid: 'bookGrid',
        hoverImageContainer: 'hoverImageContainer',
        modalOverlay: 'modalOverlay',
        modalContent: 'modalContent',
    };

    const CLASSES = {
        visible: 'visible',
        isOpen: 'is-open',
        indexRow: 'index-row',
        gridTile: 'grid-tile',
        closeBtn: 'close-btn',
        hoverImage: 'hover-image',
    };
    
    // Sparkle data from dazzle-gradient-header components/Sparkles.tsx implies use of lucide-react Sparkle
    // We will use a simple SVG path for the sparkle to replicate it without external deps
    // This path is a generic 4-point star/sparkle
    const SPARKLE_PATH = "M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z";

    return {
        SVG_NS,
        BOOKS,
        DAZZLE_TEXT,
        DAZZLE_COLORS,
        ELEMENTS,
        CLASSES,
        SPARKLE_PATH
    };
})();
