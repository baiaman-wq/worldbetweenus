/* ==========================================================================
   CUSTOM 8-BIT RETRO CURSOR INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  let posX = 0;
  let posY = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Track pointer movements
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Make sure cursor is visible when moving
    if (cursor.style.opacity === '0') {
      cursor.style.opacity = '1';
    }
  });

  // Buttery-smooth animation loop using requestAnimationFrame (lerp)
  function animateCursor() {
    // Lerp calculation for organic lag-behind effect (highly responsive yet smooth)
    posX += (mouseX - posX) * 0.4;
    posY += (mouseY - posY) * 0.4;
    
    cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }
  
  // Start loop
  animateCursor();

  // Hide cursor when mouse leaves the viewport
  document.addEventListener('pointerleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('pointerenter', () => {
    cursor.style.opacity = '1';
  });

  // Attach state listeners to interactive elements
  function updateInteractiveListeners() {
    // Hover states for links, buttons and modal closures
    const hoverables = document.querySelectorAll('a, button, input[type="submit"], .retro-window-close, .win98-btn');
    hoverables.forEach(el => {
      // Avoid duplicate binding
      if (el.dataset.cursorBoundHover) return;
      el.dataset.cursorBoundHover = 'true';

      el.addEventListener('pointerenter', () => {
        cursor.classList.add('hover');
      });
      el.addEventListener('pointerleave', () => {
        cursor.classList.remove('hover');
      });
    });

    // Grabbing states for draggable game/workspace items
    const draggables = document.querySelectorAll('.drag-item, .coin-scatter-item, .book-card-drag');
    draggables.forEach(el => {
      if (el.dataset.cursorBoundDrag) return;
      el.dataset.cursorBoundDrag = 'true';

      el.addEventListener('pointerenter', () => {
        cursor.classList.add('hover');
      });
      el.addEventListener('pointerleave', () => {
        cursor.classList.remove('hover');
      });
      
      // Pointer down simulates grabbing (clenched fist)
      el.addEventListener('pointerdown', () => {
        cursor.classList.add('grabbing');
        cursor.classList.remove('hover');
      });
      
      el.addEventListener('pointerup', () => {
        cursor.classList.remove('grabbing');
        cursor.classList.add('hover');
      });
    });
  }

  // Initial binding
  updateInteractiveListeners();

  // Expose binding function globally to bind dynamically generated elements (e.g. new stickers)
  window.updateCursorListeners = updateInteractiveListeners;
});
