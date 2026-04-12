document.addEventListener('DOMContentLoaded', () => {
  // Password Show/Hide Toggle
  const toggleButtons = document.querySelectorAll('.input-toggle');
  
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('.material-symbols-outlined');
      
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        if (icon) icon.textContent = 'visibility';
      }
    });
  });

  // Subject Selection Logic (Register Page)
  const subjectChips = document.querySelectorAll('.subject-chip');
  if (subjectChips.length > 0) {
    subjectChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });
  }

  // Form Validation
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const inputs = form.querySelectorAll('.input-field');
      
      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup?.querySelector('.form-error');
        
        if (input.required && !input.value.trim()) {
           isValid = false;
           showError(formGroup, errorEl, 'This field is required');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
           isValid = false;
           showError(formGroup, errorEl, 'Please enter a valid email address');
        } else if (input.type === 'password' && input.value.length < 8) {
           isValid = false;
           showError(formGroup, errorEl, 'Password must be at least 8 characters');
        } else {
           clearError(formGroup, errorEl);
        }
      });

      // Special check for subject selection on register
      if (form.id === 'register-form') {
        const selectedSubjects = document.querySelectorAll('.subject-chip.selected');
        const subjectError = document.getElementById('subject-error');
        if (selectedSubjects.length === 0) {
          isValid = false;
          if (subjectError) subjectError.style.display = 'block';
        } else {
          if (subjectError) subjectError.style.display = 'none';
        }
      }

      if (!isValid) {
        e.preventDefault();
      }
      // If valid, allows default form submission (which links to next page in our prototype)
    });

    // Clear error on input
    form.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup?.querySelector('.form-error');
        clearError(formGroup, errorEl);
      });
    });
  });
});

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

function showError(group, errorEl, message) {
  if (group) group.classList.add('has-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearError(group, errorEl) {
  if (group) group.classList.remove('has-error');
  if (errorEl) {
    errorEl.style.display = 'none';
  }
}
