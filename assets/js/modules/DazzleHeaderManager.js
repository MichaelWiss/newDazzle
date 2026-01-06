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
        this.textWrapper = null;
        this.observer = null;
        this.resizeHandler = null;
        
        // Animation state for JS-driven gradient (Safari compatibility)
        this.animationId = null;
        this.animationOffset = 0;
        this.animationSpeed = 10; // pixels per frame (~600px/sec at 60fps)
        this.isPaused = false;
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.animateGradient = this.animateGradient.bind(this);
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
            // Reveal content after initial calculation
            if (this.textWrapper) {
                DOMUtils.addClass(this.textWrapper, 'loaded');
            }
            // Start JS-driven gradient animation (Safari compatible)
            this.startGradientAnimation();
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
        this.textWrapper = DOMUtils.createElement('div', 'dazzle-text-wrapper');
        
        // Gradient Text Generation
        this.gradientText = DOMUtils.createElement('span', 'gradient-text');
        const words = Constants.DAZZLE_TEXT.trim().split(/\s+/);
        const fragment = document.createDocumentFragment();
        
        words.forEach((word, index) => {
            // Wrapper for Animation & Layout
            const wordSpan = DOMUtils.createElement('span', 'gradient-word');
            DOMUtils.applyStyles(wordSpan, { animationDelay: `${index * 0.04}s` });
            
            // Inner span for Gradient & Clipping (Fixes Safari)
            const innerSpan = DOMUtils.createElement('span', 'gradient-text-clip', { text: word });
            
            DOMUtils.append(wordSpan, innerSpan);
            fragment.appendChild(wordSpan);
            
            if (index < words.length - 1) {
                fragment.appendChild(document.createTextNode(' '));
            }
        });

        DOMUtils.append(this.gradientText, fragment);
        DOMUtils.append(this.textWrapper, this.gradientText);

        // Render Sparkles
        this.renderSparkles(this.textWrapper);

        DOMUtils.append(contentWrapper, this.textWrapper);

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
            // Apply variable to the inner clip element or the wrapper depending on CSS strategy
            // We apply to wrapper, and inner inherits or uses it
            span.style.setProperty('--bg-x', `-${relativeX}px`);
        });
    }

    /**
     * Start the JS-driven gradient animation loop
     * This replaces CSS animation for Safari compatibility
     */
    startGradientAnimation() {
        if (this.animationId) return; // Already running
        this.animateGradient();
    }

    /**
     * Animation frame callback - updates gradient offset
     */
    animateGradient() {
        if (!this.isPaused && this.gradientText) {
            // Increment offset
            this.animationOffset += this.animationSpeed;
            
            // Reset when we've scrolled one full viewport width (seamless loop)
            const viewportWidth = window.innerWidth;
            if (this.animationOffset >= viewportWidth) {
                this.animationOffset = 0;
            }
            
            // Apply offset to all gradient-word elements
            const spans = this.gradientText.querySelectorAll('.gradient-word');
            spans.forEach(span => {
                span.style.setProperty('--bg-offset', `${this.animationOffset}px`);
            });
        }
        
        // Continue animation loop
        this.animationId = requestAnimationFrame(this.animateGradient);
    }

    /**
     * Stop the gradient animation
     */
    stopGradientAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Setup intersection observer for performance
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOMUtils.removeClass(this.container, 'paused');
                    this.isPaused = false;
                } else {
                    DOMUtils.addClass(this.container, 'paused');
                    this.isPaused = true;
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
        // Stop gradient animation
        this.stopGradientAnimation();
        
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
        this.animationOffset = 0;
        this.isPaused = false;
    }
}
