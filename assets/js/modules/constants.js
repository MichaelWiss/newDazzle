/**
 * Constants Module
 * Configuration and data for Dazzle Row Demo
 */
import { SiteData } from '../data.js';

const siteData = SiteData || {};
const dazzleData = siteData.dazzle || {};

const PROJECTS = siteData.projects || [];
const RESUME_DATA = siteData.resume || {};
const DAZZLE_TEXT = dazzleData.text || '';
const DAZZLE_COLORS = dazzleData.colors || [];

const ELEMENTS = {
    dazzleHeader: 'dazzleHeader',
    modalOverlay: 'modal-overlay',
    modalContent: 'modal-content',
    hoverImageContainer: 'hover-image-container'
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

const SPARKLE_CONFIGS = [
    { size: 64, color: '#FFD700', style: { top: '8%', left: '-2%' } },
    { size: 48, color: '#05d5ff', style: { bottom: '20%', right: '5%', animationDelay: '1.2s' } },
    { size: 32, color: '#ff5ca8', style: { top: '40%', left: '45%', opacity: '0.6', animationDelay: '2.5s' } }
];

export const Constants = {
    PROJECTS,
    RESUME_DATA,
    DAZZLE_TEXT,
    ELEMENTS,
    CLASSES,
    SPARKLE_PATH,
    SPARKLE_CONFIGS
};
