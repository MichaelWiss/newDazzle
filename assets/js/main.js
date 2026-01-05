/**
 * Main Application Entry Point
 * Orchestrates the rendering of the Dazzle Header and Row Demo
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Dazzle Header
    DazzleRenderer.render('dazzleHeader');

    // 2. Render Row Demo Body
    RowRenderer.render('rowDemo');
});
