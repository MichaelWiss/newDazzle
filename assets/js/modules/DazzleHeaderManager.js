/**
 * DazzleHeaderManager Class
 * Manages the Dazzle header animation, sparkles, and layout.
 */
import { DOMUtils } from './domUtils.js';
import { Constants } from './constants.js';

export class DazzleHeaderManager {
    constructor() {
        this.container = null;
        this.gradientText = null;
        this.observer = null;
        this.resizeHandler = null;
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Initialize the Dazzle Header
     * @param {string} containerId 
     */
    init(containerId) {
        this.container = DOMUtils.byId(containerId);
        if (!this.container) {
            console.error(`Dazzle container #${containerId} not found`);
            return;
        }

        DOMUtils.clearChildren(this.container);
        DOMUtils.addClass(this.container, 'dazzle-header');

        this.renderBackground();
        this.renderContent();

        // Setup Observers & Listeners
        this.setupIntersectionObserver();
        this.setupResizeHandler();

        // Initial Calculation
        requestAnimationFrame(() => {
            this.updateGradientPositions();
        });

        // Robustness: Recalculate on window load to ensure fonts are ready
        // This fixes the Safari "blocky text" issue where measurements happen before font load
        window.addEventListener('load', () => {
             this.updateGradientPositions();
        });
    }

    /**
     * Render background blobs
     */
    renderBackground() {
        const blobPurple = DOMUtils.createElement('div', 'bg-blob bg-blob-purple');
        const blobBlue = DOMUtils.createElement('div', 'bg-blob bg-blob-blue');
        DOMUtils.appendChildren(this.container, [blobPurple, blobBlue]);
    }

    /**
     * Render main content
     */
    renderContent() {
        const contentWrapper = DOMUtils.createElement('div', 'dazzle-content');
        const textWrapper = DOMUtils.createElement('div', 'dazzle-text-wrapper');
        
        // Gradient Text Generation
        this.gradientText = DOMUtils.createElement('span', 'gradient-text');
        const words = Constants.DAZZLE_TEXT.trim().split(/\s+/);
        const fragment = document.createDocumentFragment();
        
        words.forEach((word, index) => {
            const wordSpan = DOMUtils.createElement('span', 'gradient-word', { text: word });
            DOMUtils.applyStyles(wordSpan, { animationDelay: `${index * 0.04}s` });
            fragment.appendChild(wordSpan);
            
            if (index < words.length - 1) {
                fragment.appendChild(document.createTextNode(' '));
            }
        });

        DOMUtils.append(this.gradientText, fragment);
        DOMUtils.append(textWrapper, this.gradientText);

        // Render Sparkles
        this.renderSparkles(textWrapper);

        DOMUtils.append(contentWrapper, textWrapper);

        // Footer
        const footer = DOMUtils.createElement('p', 'dazzle-footer', { text: 'Powered by Vanilla JS' });
        DOMUtils.append(contentWrapper, footer);

        DOMUtils.append(this.container, contentWrapper);
    }

    /**
     * Render sparkles based on config
     */
    renderSparkles(parent) {
        Constants.SPARKLE_CONFIGS.forEach(config => {
            const wrapper = DOMUtils.createElement('div', 'sparkle-container');
            DOMUtils.applyStyles(wrapper, config.style);
            
            const svg = this.createSparkleSVG(config.size, config.color);
            DOMUtils.append(wrapper, svg);
            DOMUtils.append(parent, wrapper);
        });
    }

    /**
     * Create Sparkle SVG Element
     */
    createSparkleSVG(size, color) {
        const svg = DOMUtils.createSVG('svg', {
            viewBox: '0 0 24 24',
            width: size,
            height: size,
            fill: color,
            class: 'sparkle-icon'
        });

        const path = DOMUtils.createSVG('path', { d: Constants.SPARKLE_PATH });
        DOMUtils.append(svg, path);
        return svg;
    }

    /**
     * Recalculate background positions for gradient text
     */
    updateGradientPositions() {
        if (!this.gradientText) return;
        const spans = this.gradientText.querySelectorAll('.gradient-word');
        
        spans.forEach(span => {
            const rect = span.getBoundingClientRect();
            const relativeX = rect.left;
            span.style.setProperty('--bg-x', `-${relativeX}px`);
        });
    }

    /**
     * Setup intersection observer for performance
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOMUtils.removeClass(this.container, 'paused');
                } else {
                    DOMUtils.addClass(this.container, 'paused');
                }
            });
        }, { threshold: 0 });
        
        this.observer.observe(this.container);
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        this.resizeHandler = this.handleResize;
        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Handle resize event
     */
    handleResize() {
         this.updateGradientPositions();
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }

        if (this.container) {
            DOMUtils.clearChildren(this.container);
        }

        this.container = null;
        this.gradientText = null;
    }
}
