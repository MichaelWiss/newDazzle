/**
 * Main Application Entry Point
 * Orchestrates the rendering of the Dazzle Header and Row Demo
 */
import '../css/dazzle.css';
import '../css/row.css';
import '../css/modal.css';
import '../css/resume.css';

import { Constants } from './modules/constants.js';
import { DazzleHeaderManager } from './modules/DazzleHeaderManager.js';
import { ModalManager } from './modules/ModalManager.js';
import { HoverCardManager } from './modules/HoverCardManager.js';
import { RowDemoManager } from './modules/RowDemoManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Header
    const headerManager = new DazzleHeaderManager();
    headerManager.init(Constants.ELEMENTS.dazzleHeader);

    // 2. Initialize Shared Modal Manager
    const modalManager = new ModalManager();
    modalManager.init(document.body);

    // 3. Initialize Hover Card Manager
    const hoverCardManager = new HoverCardManager();

    // 4. Initialize Row Demo with Modal + Hover dependencies
    const rowDemoManager = new RowDemoManager({ modalManager, hoverCardManager });
    rowDemoManager.init('rowDemo');
    

});
