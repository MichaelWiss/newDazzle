/**
 * Dazzle Renderer Module
 * Handles text animation and sparkle rendering for the header
 */

const DazzleRenderer = (() => {
    
    const createSparkle = (size, color, style = {}) => {
        const svg = DOMUtils.createSVG('svg', {
            viewBox: '0 0 24 24',
            width: size,
            height: size,
            fill: color,
            class: 'sparkle-icon',
            style: Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')
        });

        const path = DOMUtils.createSVG('path', {
            d: Constants.SPARKLE_PATH
        });

        DOMUtils.append(svg, path);
        return svg;
    };

    const render = (containerId) => {
        const container = DOMUtils.byId(containerId);
        if (!container) {
            console.error(`Dazzle container #${containerId} not found`);
            return;
        }

        // Structure:
        // <div class="dazzle-header">
        //   <div class="bg-blob bg-blob-purple"></div>
        //   <div class="bg-blob bg-blob-blue"></div>
        //   <div class="dazzle-content">
        //      <div class="dazzle-text-wrapper">
        //          <span class="gradient-text">...words...</span>
        //          <div class="sparkle-container">...</div>
        //      </div>
        //      <p class="dazzle-footer">Powered by Vanilla JS</p>
        //   </div>
        // </div>

        DOMUtils.clearChildren(container);
        DOMUtils.addClass(container, 'dazzle-header');

        // Background Blobs
        const blobPurple = DOMUtils.createElement('div', 'bg-blob bg-blob-purple');
        const blobBlue = DOMUtils.createElement('div', 'bg-blob bg-blob-blue');
        DOMUtils.append(container, blobPurple);
        DOMUtils.append(container, blobBlue);

        // Content Wrapper
        const contentWrapper = DOMUtils.createElement('div', 'dazzle-content');
        
        // Text Wrapper
        const textWrapper = DOMUtils.createElement('div', 'dazzle-text-wrapper');
        
        // Gradient Text
        const gradientText = DOMUtils.createElement('span', 'gradient-text');
        
        // Remove manual styling - rely on CSS classes
        
        // Split text into words
        const words = Constants.DAZZLE_TEXT.trim().split(/\s+/);
        const fragment = document.createDocumentFragment();
        
        words.forEach((word, index) => {
            const wordSpan = DOMUtils.createElement('span', 'gradient-word', { text: word });
            
            // Set initial animation delay
            DOMUtils.applyStyles(wordSpan, {
                animationDelay: `${index * 0.04}s`
            });
            
            fragment.appendChild(wordSpan);
            
            // Add space
            if (index < words.length - 1) {
                fragment.appendChild(document.createTextNode(' '));
            }
        });

        DOMUtils.append(gradientText, fragment);
        DOMUtils.append(textWrapper, gradientText);

        // ... Sparkles ...
        
        // Calculate Positions after Layout
        // We need to wait for the DOM to update. Since we just appended, layout is invalidated.
        // Reading offsetLeft forces reflow, which is what we need to get positions.
        requestAnimationFrame(() => {
            const spans = gradientText.querySelectorAll('.gradient-word');
            const containerRect = gradientText.getBoundingClientRect();
            
            spans.forEach(span => {
                const rect = span.getBoundingClientRect();
                // Calculate position relative to viewport or container?
                // If background-size is 100vw, we want position relative to viewport.
                // If we want the rainbow to be "fixed" to the screen X axis:
                const relativeX = rect.left;
                
                // Set --bg-x to negative offset to align the background "behind" the text
                span.style.setProperty('--bg-x', `-${relativeX}px`);
            });
        });

        // Handle Resize to keep alignment
        window.addEventListener('resize', () => {
             const spans = gradientText.querySelectorAll('.gradient-word');
             spans.forEach(span => {
                const rect = span.getBoundingClientRect();
                const relativeX = rect.left;
                span.style.setProperty('--bg-x', `-${relativeX}px`);
             });
        });

        // Sparkles
        // Config based on React component:
        // Top Left: size 64, gold
        const s1Wrapper = DOMUtils.createElement('div', 'sparkle-container');
        DOMUtils.applyStyles(s1Wrapper, { top: '8%', left: '-2%' });
        DOMUtils.append(s1Wrapper, createSparkle(64, '#FFD700'));
        DOMUtils.append(textWrapper, s1Wrapper);

        // Bottom Right: size 48, cyan, delay 1.2s
        const s2Wrapper = DOMUtils.createElement('div', 'sparkle-container');
        DOMUtils.applyStyles(s2Wrapper, { bottom: '20%', right: '5%', animationDelay: '1.2s' });
        DOMUtils.append(s2Wrapper, createSparkle(48, '#05d5ff'));
        DOMUtils.append(textWrapper, s2Wrapper);

        // Center: size 32, pink, delay 2.5s, opacity 0.6
        const s3Wrapper = DOMUtils.createElement('div', 'sparkle-container');
        DOMUtils.applyStyles(s3Wrapper, { top: '40%', left: '45%', opacity: '0.6', animationDelay: '2.5s' });
        DOMUtils.append(s3Wrapper, createSparkle(32, '#ff5ca8'));
        DOMUtils.append(textWrapper, s3Wrapper);


        DOMUtils.append(contentWrapper, textWrapper);

        // Footer
        const footer = DOMUtils.createElement('p', 'dazzle-footer', { text: 'Powered by Vanilla JS' });
        DOMUtils.append(contentWrapper, footer);

        DOMUtils.append(container, contentWrapper);

        // Performance: Pause animations when off-screen
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOMUtils.removeClass(container, 'paused');
                } else {
                    DOMUtils.addClass(container, 'paused');
                }
            });
        }, { threshold: 0 });
        
        observer.observe(container);
    };

    return {
        render
    };
})();
