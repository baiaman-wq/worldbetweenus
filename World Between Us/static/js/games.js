/* ==========================================================================
   INTERACTIVE DRAG-AND-DROP COLLISION GAMES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStealBooksGame();
  initCoinPurseGame();
});

/* --------------------------------------------------------------------------
   GAME 1: STEAL BOOKS IN BAG
   -------------------------------------------------------------------------- */
function initStealBooksGame() {
  const books = document.querySelectorAll('.book-card-drag');
  const bag = document.querySelector('.bag-graphic-wrapper');
  const counter = document.getElementById('stolen-count');

  if (!bag || books.length === 0) return;

  let stolenCount = 0;

  books.forEach((book, index) => {
    const rotation = -12 + Math.random() * 24;
    const offsetX = -15 + Math.random() * 30;
    const offsetY = -15 + Math.random() * 30;

    book.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${rotation}deg)`;
    book.dataset.rot = rotation;
    book.dataset.ox = offsetX;
    book.dataset.oy = offsetY;

    setupGameDrag(book, bag, (isColliding) => {
      if (isColliding) {
        stolenCount++;
        if (counter) counter.innerText = stolenCount;
        bag.classList.add('pulse');
        setTimeout(() => bag.classList.remove('pulse'), 300);
        book.style.pointerEvents = 'none';
        book.style.transition = 'all 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
        book.style.transform = 'scale(0) rotate(180deg)';
        book.style.opacity = '0';
        setTimeout(() => book.remove(), 400);
      } else {
        book.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        book.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${rotation}deg)`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   GAME 2: HELLO KITTY COIN PURSE (Fixed drag + collision)
   -------------------------------------------------------------------------- */
function initCoinPurseGame() {
  const purse = document.querySelector('.purse-drop-zone');
  const coinScatterZone = document.querySelector('.game-coin-purse');
  const countDisplay = document.getElementById('coin-collected-count');

  if (!purse || !coinScatterZone) return;

  let collectedCount = 0;

  const coinCoords = [
    { x: 8,  y: 15 }, { x: 22, y: 55 }, { x: 38, y: 20 },
    { x: 52, y: 60 }, { x: 12, y: 72 }, { x: 35, y: 78 },
    { x: 65, y: 18 }, { x: 72, y: 65 }, { x: 55, y: 10 }
  ];

  coinCoords.forEach((coord) => {
    const coin = document.createElement('div');
    coin.className = 'coin-scatter-item';
    coin.style.left = `${coord.x}%`;
    coin.style.top = `${coord.y}%`;
    coin.style.touchAction = 'none';
    coin.innerHTML = `<img src="/static/images/coin_ruble.svg" alt="рубль" width="100%" height="100%" draggable="false">`;
    coinScatterZone.appendChild(coin);

    const rotation = Math.random() * 360;
    coin.style.transform = `rotate(${rotation}deg)`;
    coin.dataset.rot = rotation;

    setupGameDrag(coin, purse, (isColliding) => {
      if (isColliding) {
        collectedCount++;
        if (countDisplay) countDisplay.innerText = collectedCount;

        purse.classList.add('purse-eat');
        setTimeout(() => purse.classList.remove('purse-eat'), 300);

        coin.style.pointerEvents = 'none';
        coin.style.transition = 'all 0.35s ease-in';
        coin.style.transform = 'scale(0) rotate(360deg)';
        coin.style.opacity = '0';
        setTimeout(() => coin.remove(), 380);
      } else {
        coin.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        coin.style.transform = `rotate(${rotation}deg)`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   DRAG ENGINE WITH COLLISION DETECTION
   -------------------------------------------------------------------------- */
function setupGameDrag(element, targetDropZone, onDropCallback) {
  let active = false;
  let startX = 0, startY = 0;
  let xOffset = 0, yOffset = 0;

  element.style.touchAction = 'none';

  element.addEventListener('pointerdown', dragStart);

  function dragStart(e) {
    e.preventDefault();
    element.setPointerCapture(e.pointerId);
    element.style.transition = 'none';
    element.style.zIndex = '200';

    startX = e.clientX - xOffset;
    startY = e.clientY - yOffset;
    active = true;

    element.addEventListener('pointermove', drag);
    element.addEventListener('pointerup', dragEnd);
    element.addEventListener('pointercancel', dragEnd);
  }

  function drag(e) {
    if (!active) return;
    e.preventDefault();

    const currentX = e.clientX - startX;
    const currentY = e.clientY - startY;
    xOffset = currentX;
    yOffset = currentY;

    const baseRot = element.dataset.rot || 0;
    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${baseRot}deg)`;
  }

  function dragEnd(e) {
    if (!active) return;
    element.releasePointerCapture(e.pointerId);
    active = false;
    element.style.zIndex = '';

    const elemRect = element.getBoundingClientRect();
    const targetRect = targetDropZone.getBoundingClientRect();

    const isColliding = !(
      elemRect.right  < targetRect.left  ||
      elemRect.left   > targetRect.right ||
      elemRect.bottom < targetRect.top   ||
      elemRect.top    > targetRect.bottom
    );

    if (isColliding) {
      onDropCallback(true);
    } else {
      xOffset = 0;
      yOffset = 0;
      onDropCallback(false);
    }

    element.removeEventListener('pointermove', drag);
    element.removeEventListener('pointerup', dragEnd);
    element.removeEventListener('pointercancel', dragEnd);
  }
}
