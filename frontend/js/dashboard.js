document.addEventListener('DOMContentLoaded', () => {
  // Count-Up Animation
  const animatedNumbers = document.querySelectorAll('.count-up');
  
  if (animatedNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const isFloat = el.getAttribute('data-float') === 'true';
          
          animateValue(el, 0, target, 1500, suffix, isFloat);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    animatedNumbers.forEach(el => observer.observe(el));
  }

  // Circular SVG Gauge Initialization
  const gauges = document.querySelectorAll('.circular-gauge');
  gauges.forEach(gauge => {
    const defaultScore = parseFloat(gauge.getAttribute('data-score') || 0);
    animateCircularGauge(gauge, defaultScore);
  });

  // Table Row Click to expand feedback (grades-feedback.html)
  const filterableRows = document.querySelectorAll('tr[data-id]');
  const feedbackSection = document.getElementById('feedback-section');
  
  if (filterableRows.length > 0 && feedbackSection) {
    filterableRows.forEach(row => {
      row.addEventListener('click', () => {
        // Only active grades can be clicked
        if(!row.querySelector('.badge-graded')) return;
        
        filterableRows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        
        feedbackSection.classList.remove('hidden');
        feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Clear Notifications
  const clearBtn = document.getElementById('clear-notifications');
  const notifContainer = document.getElementById('notifications-list');
  
  if (clearBtn && notifContainer) {
    clearBtn.addEventListener('click', () => {
      notifContainer.innerHTML = '<div class="p-4 text-center text-muted text-sm">No new notifications.</div>';
    });
  }

  // Dashboard Filters (my-assignments.html)
  const filterTabs = document.querySelectorAll('.filter-tab');
  const assignmentCards = document.querySelectorAll('.assignment-card');
  const searchInput = document.getElementById('assignment-search');

  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        // Update active class
        filterTabs.forEach(t => {
          t.classList.remove('bg-gradient', 'text-white');
          t.classList.add('text-muted');
        });
        tab.classList.remove('text-muted');
        tab.classList.add('bg-gradient', 'text-white');

        const filterValue = tab.getAttribute('data-filter');
        filterCards(filterValue, searchInput ? searchInput.value : '');
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.filter-tab.bg-gradient');
      const filterValue = activeTab ? activeTab.getAttribute('data-filter') : 'all';
      filterCards(filterValue, e.target.value);
    });
  }

  function filterCards(status, query) {
    const q = query.toLowerCase();
    assignmentCards.forEach(card => {
      const cardStatus = card.getAttribute('data-status');
      const cardTitle = card.querySelector('h3').textContent.toLowerCase();
      
      const statusMatch = status === 'all' || cardStatus === status;
      const queryMatch = cardTitle.includes(q);
      
      if (statusMatch && queryMatch) {
        card.style.display = 'block';
        card.classList.add('fade-up', 'visible');
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Drag and Drop File Upload
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-upload');
  
  if (dropZone && fileInput) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
      dropZone.addEventListener(type, () => {
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        updateFileName(e.dataTransfer.files[0].name);
      }
    });

    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        updateFileName(fileInput.files[0].name);
      }
    });

    function updateFileName(name) {
      dropZone.innerHTML = `
        <div class="icon-container success text-2xl mb-2">
          <span class="material-symbols-outlined">check_circle</span>
        </div>
        <h4 class="font-bold text-lg mb-1">${name}</h4>
        <p class="text-sm text-primary">Click to change file</p>
      `;
    }
  }

});

// Helper for Number Animation
function animateValue(obj, start, end, duration, suffix = '', isFloat = false) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeOut;
    
    if (isFloat) {
      obj.innerHTML = current.toFixed(1) + suffix;
    } else {
      obj.innerHTML = Math.floor(current) + suffix;
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Helper for SVG Gauge
function animateCircularGauge(gaugeEl, score) {
  const circle = gaugeEl.querySelector('.gauge-progress');
  if(!circle) return;
  
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
  
  const offset = circumference - (score / 100) * circumference;
  
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
    // Set color based on score
    if(score >= 90) circle.style.stroke = 'var(--primary)';
    else if(score >= 75) circle.style.stroke = 'var(--secondary)';
    else if(score >= 60) circle.style.stroke = 'var(--status-pending-text)';
    else circle.style.stroke = 'var(--error)';
  }, 100); // slight delay for trigger
}
