/**
 * Main Application Entry Point
 * Orchestrates the rendering of the Dazzle Header and Row Demo
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Header
    const headerManager = new DazzleHeaderManager();
    headerManager.init(Constants.ELEMENTS.dazzleHeader);

    // 2. Initialize Shared Modal Manager
    const modalManager = new ModalManager();

    // 3. Initialize Row Demo with Modal dependency
    const rowDemoManager = new RowDemoManager({ modalManager });
    rowDemoManager.init('rowDemo');
    
    // Expose for debugging
    window.App = {
        header: headerManager,
        modal: modalManager,
        rowDemo: rowDemoManager
    };
});
