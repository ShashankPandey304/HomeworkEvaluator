document.addEventListener('DOMContentLoaded', () => {
  const scoreInput = document.getElementById('score-input');
  const mainGauge = document.getElementById('ai-gauge');
  const gaugeText = document.getElementById('gauge-text');
  const approveBtn = document.getElementById('approve-btn');
  const editBtn = document.getElementById('edit-btn');
  const successBanner = document.getElementById('success-banner');
  const remarksTextarea = document.getElementById('tutor-remarks');

  // Interactive Gauge Update
  if (scoreInput && mainGauge) {
    scoreInput.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      
      // Enforce 0-100 range
      if (val !== '' && !isNaN(val)) {
        let num = parseInt(val);
        if (num > 100) val = 100;
        if (num < 0) val = 0;
        e.target.value = val;
        
        // Update SVG text and stroke
        if(gaugeText) gaugeText.textContent = val;
        updateGaugeStroke(mainGauge, val);
      } else {
        if(gaugeText) gaugeText.textContent = '--';
        updateGaugeStroke(mainGauge, 0);
      }
    });
    
    // Initial draw
    updateGaugeStroke(mainGauge, parseInt(scoreInput.value) || 0);
  }

  // Edit Button function
  if (editBtn && scoreInput) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll to input
      scoreInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus and highlight
      setTimeout(() => {
        scoreInput.focus();
        scoreInput.classList.add('highlight-ring');
        remarksTextarea.classList.add('highlight-ring');
        
        setTimeout(() => {
          scoreInput.classList.remove('highlight-ring');
          remarksTextarea.classList.remove('highlight-ring');
        }, 2000);
      }, 500);
    });
  }

  // Approve Button function
  if (approveBtn) {
    approveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Set to loading state
      const originalText = approveBtn.innerHTML;
      approveBtn.innerHTML = '<span class="spinner"></span> Approving...';
      approveBtn.disabled = true;
      
      // Simulate network request using Promise
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success State
      approveBtn.classList.remove('btn-primary');
      approveBtn.style.backgroundColor = 'var(--status-graded-text)';
      approveBtn.style.color = '#fff';
      approveBtn.innerHTML = '<span class="material-symbols-outlined success-pop">check_circle</span> Published!';
      
      if(successBanner) {
        successBanner.style.display = 'flex';
        successBanner.classList.add('slide-in-right');
      }
      
      // Optional: hide edit button
      if(editBtn) editBtn.style.display = 'none';
      if(scoreInput) scoreInput.disabled = true;
      if(remarksTextarea) remarksTextarea.disabled = true;
    });
  }
});

function updateGaugeStroke(gaugeEl, score) {
  const circle = gaugeEl.querySelector('.gauge-progress');
  if(!circle) return;
  
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  
  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  
  if(score >= 90) circle.style.stroke = 'var(--primary)';
  else if(score >= 75) circle.style.stroke = 'var(--secondary)';
  else if(score >= 60) circle.style.stroke = 'var(--status-pending-text)';
  else circle.style.stroke = 'var(--error)';
}
