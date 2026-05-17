/* ==========================================================================
   FORM POPUPS (WIN98 WINDOWS) & GRIEVANCE STICKER WALL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initWin98Modals();
  initGrievanceWall();
  initApplicationForm();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   WIN98 MODAL WINDOW CONTROL
   -------------------------------------------------------------------------- */
function initWin98Modals() {
  const overlay = document.querySelector('.modal-overlay-blur');
  const closeButtons = document.querySelectorAll('.retro-window-close, .close-win-btn');
  
  // Close any active modal
  function closeAllModals() {
    document.querySelectorAll('.retro-window-modal').forEach(modal => {
      modal.classList.remove('active');
    });
    if (overlay) overlay.style.display = 'none';
  }

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  if (overlay) {
    overlay.addEventListener('click', closeAllModals);
  }

  // Global triggers
  window.openWin98Modal = function(modalId) {
    closeAllModals();
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      if (overlay) overlay.style.display = 'block';
      targetModal.classList.add('active');
      
      // Dynamic center and coordinates
      targetModal.style.top = '50%';
      targetModal.style.left = '50%';
    }
  };
}

/* --------------------------------------------------------------------------
   GRIEVANCE WALL INTERACTIVES (Sticker Pinning)
   -------------------------------------------------------------------------- */
function initGrievanceWall() {
  const grievanceForm = document.getElementById('grievance-form');
  const wallBoard = document.getElementById('wall-board');
  
  if (!grievanceForm || !wallBoard) return;

  // Distribute pre-rendered stickers randomly on page load
  const stickers = wallBoard.querySelectorAll('.grievance-sticker');
  
  // Clean container bounding check to keep stickers inside
  const totalStickers = stickers.length;
  stickers.forEach((sticker, index) => {
    scatterSticker(sticker, index, totalStickers);
  });

  grievanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(grievanceForm);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

    fetch('/api/grievances/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Сервер грустит и не отвечает...');
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Clear input form
        grievanceForm.reset();
        
        // Close modal
        window.openWin98Modal('success-modal');
        
        // Dynamically create a brand new sticky note sticker!
        const g = data.grievance;
        const sticker = document.createElement('div');
        sticker.className = 'grievance-sticker';
        sticker.style.backgroundColor = g.sticker_color;
        sticker.style.animation = 'stick-on 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        
        sticker.innerHTML = `
          <div class="sticker-text">${g.text}</div>
          <div class="sticker-author">— ${g.author}</div>
        `;
        
        wallBoard.appendChild(sticker);
        
        // Scatter it with high index priorities
        scatterSticker(sticker, totalStickers + 1, totalStickers + 2);
        
        // Rebind cursor listeners for new sticker
        if (window.updateCursorListeners) {
          window.updateCursorListeners();
        }
      }
    })
    .catch(error => {
      alert(error.message);
    });
  });

  function scatterSticker(sticker, index, total) {
    // Math logic to avoid pile overlapping (divide board into grids)
    const columns = Math.ceil(Math.sqrt(total || 10));
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    // Position percentage inside column/row grid + subtle random offset
    const stepX = 90 / columns;
    const stepY = 80 / columns;
    
    const posX = Math.max(5, Math.min(85, (col * stepX) + (Math.random() * (stepX * 0.4))));
    const posY = Math.max(10, Math.min(75, (row * stepY) + (Math.random() * (stepY * 0.4))));
    
    const rotation = -8 + Math.random() * 16;
    
    sticker.style.left = `${posX}%`;
    sticker.style.top = `${posY}%`;
    sticker.style.transform = `rotate(${rotation}deg)`;
  }
}

/* --------------------------------------------------------------------------
   SCHOOL PROGRAM APPLICATIONS FORM (Fetch POST API)
   -------------------------------------------------------------------------- */
function initApplicationForm() {
  const appForm = document.getElementById('application-form');
  if (!appForm) return;

  appForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(appForm);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

    fetch('/api/applications/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Reset form inputs
        appForm.reset();
        
        // Show success retro dialog
        const successMessage = document.getElementById('success-message-text');
        if (successMessage) {
          successMessage.innerText = data.message;
        }
        window.openWin98Modal('success-modal');
      } else {
        alert(data.error || 'Произошла ошибка при отправке заявки.');
      }
    })
    .catch(error => {
      alert('Не удалось подключиться к серверу грусти...');
    });
  });
}

/* --------------------------------------------------------------------------
   HIGHLIGHT SCROLL ANIMATIONS (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const highlights = document.querySelectorAll('.marker-highlight');
  
  const options = {
    threshold: 0.8,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('highlight-active');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  highlights.forEach(h => observer.observe(h));
}
