/* ==========================================================================
   DRAGGABLE STICKERS / FILE PAPERS (PointerEvents Engine)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const dragItems = document.querySelectorAll('.drag-item');
  const container = document.querySelector('.hero-concrete');

  if (!container || dragItems.length === 0) return;

  // Spread folders across the workspace
  dragItems.forEach((item, index) => {
    let topVal, leftVal;

    if (index === 0) { topVal = 25; leftVal = 8;  }  // radio.mp4
    else if (index === 1) { topVal = 60; leftVal = 78; } // gallery.pdf
    else if (index === 2) { topVal = 68; leftVal = 10; } // litzin.txt
    else if (index === 3) { topVal = 20; leftVal = 72; } // vintage photo
    else if (index === 4) { topVal = 42; leftVal = 85; } // star
    else {
      topVal = 25 + Math.random() * 50;
      leftVal = 5 + Math.random() * 85;
    }

    item.style.top  = `${topVal}%`;
    item.style.left = `${leftVal}%`;
    item.style.touchAction = 'none';

    setupDrag(item);
  });

  function setupDrag(element) {
    let active  = false;
    let xOffset = 0;
    let yOffset = 0;
    let startX, startY;
    let hasMoved = false;   // Track if it was a click or a drag

    element.addEventListener('pointerdown', dragStart);

    function dragStart(e) {
      e.preventDefault();
      element.setPointerCapture(e.pointerId);
      element.style.transition = 'none';
      element.style.zIndex = '500';

      startX  = e.clientX - xOffset;
      startY  = e.clientY - yOffset;
      hasMoved = false;
      active   = true;

      element.addEventListener('pointermove', drag);
      element.addEventListener('pointerup',   dragEnd);
      element.addEventListener('pointercancel', dragEnd);
    }

    function drag(e) {
      if (!active) return;
      e.preventDefault();

      const currentX = e.clientX - startX;
      const currentY = e.clientY - startY;

      // Only count as drag if moved more than 5px
      if (Math.abs(currentX - xOffset) > 5 || Math.abs(currentY - yOffset) > 5) {
        hasMoved = true;
      }

      xOffset = currentX;
      yOffset = currentY;

      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    function dragEnd(e) {
      if (!active) return;
      element.releasePointerCapture(e.pointerId);
      active = false;
      element.style.zIndex = '';
      element.style.transition = 'transform 0.15s ease';

      // If barely moved — treat as a CLICK → open modal
      if (!hasMoved) {
        handleFolderClick(element);
      }

      element.removeEventListener('pointermove', drag);
      element.removeEventListener('pointerup',   dragEnd);
      element.removeEventListener('pointercancel', dragEnd);
    }
  }

  // Folder click handler — opens Win98 modal with content
  function handleFolderClick(element) {
    const label = element.querySelector('span');
    if (!label) return;

    const name = label.textContent.trim();

    const contentMap = {
      'radio.mp4': {
        title: '📻 radio.mp4 — прослушать эфир',
        body: 'Наше лоу-фай радио выходит каждую пятницу. Эфир о меланхолии, спальных районах и грустном рэпе. <br><br><a href="https://t.me" target="_blank" style="color:#1084D0;">→ слушать в телеграм</a>'
      },
      'gallery.pdf': {
        title: '🖼 gallery.pdf — галерея школы дизайна',
        body: 'Работы студентов: коллажи, web-арт, помятые зины и инсталляции о выгорании. <br><br><em>Следующая выставка — июнь 2026.</em>'
      },
      'litzin.txt': {
        title: '📄 litzin.txt — литературный зин',
        body: 'Сборник эссе, аутофикшна и поэзии депрессии. Выпуск #3 уже доступен. <br><br><a href="#" style="color:#1084D0;">→ читать онлайн</a>'
      }
    };

    const info = contentMap[name];
    if (!info) return;

    // Reuse existing success modal to show folder content
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      const titleEl = successModal.querySelector('.retro-window-title');
      const msgEl   = document.getElementById('success-message-text');
      const h3      = successModal.querySelector('h3');

      if (titleEl) titleEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="white" style="margin-right:4px"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>${info.title}`;
      if (h3) h3.style.display = 'none';
      if (msgEl) msgEl.innerHTML = info.body;

      if (window.openWin98Modal) window.openWin98Modal('success-modal');
    }
  }
});
