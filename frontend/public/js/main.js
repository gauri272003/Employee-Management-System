/**
 * GYANVIX EMPLOYEE MANAGEMENT SYSTEM
 * Main JavaScript File
 */

// ============================================
// DOM CONTENT LOADED
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap tooltips
  initializeTooltips();

  // Initialize form validation
  initializeFormValidation();

  // Auto-dismiss alerts after 5 seconds
  autoDismissAlerts();

  // Initialize search with debounce
  initializeSearch();

  // Format phone number inputs
  formatPhoneInputs();

  // Uppercase employee ID inputs
  uppercaseEmployeeId();

  // Set max date for joining date
  setMaxJoiningDate();

  console.log('✅ Gyanvix EMS initialized successfully');
});

// ============================================
// TOOLTIP INITIALIZATION
// ============================================

function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );

  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// ============================================
// FORM VALIDATION
// ============================================

function initializeFormValidation() {
  // Get all forms with validation
  const forms = document.querySelectorAll('form[novalidate]');

  // Loop over forms and prevent submission if invalid
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          // Scroll to first invalid field
          const firstInvalid = form.querySelector(':invalid');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            firstInvalid.focus();
          }
        }

        form.classList.add('was-validated');
      },
      false
    );

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        if (this.checkValidity()) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      });

      input.addEventListener('input', function () {
        if (form.classList.contains('was-validated')) {
          if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
          }
        }
      });
    });
  });
}

// ============================================
// AUTO DISMISS ALERTS
// ============================================

function autoDismissAlerts() {
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');

  alerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000); // 5 seconds
  });
}

// ============================================
// SEARCH WITH DEBOUNCE
// ============================================

function initializeSearch() {
  const searchInput = document.getElementById('search');

  if (searchInput) {
    let debounceTimer;

    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function () {
        // Submit form automatically after typing stops
        // Uncomment below line to enable auto-search
        // document.getElementById('filterForm').submit();
      }, 500); // 500ms delay
    });

    // Submit on Enter key
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('filterForm').submit();
      }
    });
  }
}

// ============================================
// PHONE NUMBER FORMATTING
// ============================================

function formatPhoneInputs() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(function (input) {
    // Allow only numbers
    input.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '');

      // Limit to 10 digits
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });

    // Prevent non-numeric keys
    input.addEventListener('keypress', function (e) {
      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
        e.preventDefault();
      }
    });
  });
}

// ============================================
// UPPERCASE EMPLOYEE ID
// ============================================

function uppercaseEmployeeId() {
  const employeeIdInputs = document.querySelectorAll('.text-uppercase');

  employeeIdInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      this.value = this.value.toUpperCase();
    });
  });
}

// ============================================
// SET MAX DATE FOR JOINING DATE
// ============================================

function setMaxJoiningDate() {
  const joiningDateInputs = document.querySelectorAll('input[name="joiningDate"]');

  if (joiningDateInputs.length > 0) {
    const today = new Date().toISOString().split('T')[0];

    joiningDateInputs.forEach(function (input) {
      if (!input.hasAttribute('max')) {
        input.setAttribute('max', today);
      }
    });
  }
}

// ============================================
// CONFIRMATION DIALOGS
// ============================================

function confirmAction(message) {
  return confirm(message || 'Are you sure you want to perform this action?');
}

// ============================================
// FORMAT CURRENCY
// ============================================

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ============================================
// LOADING SPINNER
// ============================================

function showLoading() {
  const loadingHTML = `
    <div id="loadingSpinner" class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style="background: rgba(0,0,0,0.5); z-index: 9999;">
      <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.remove();
  }
}

// ============================================
// SHOW NOTIFICATION
// ============================================

function showNotification(message, type = 'success') {
  const alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" role="alert" style="z-index: 9999; min-width: 300px;">
      <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', alertHTML);

  // Auto dismiss after 3 seconds
  setTimeout(function () {
    const alert = document.querySelector('.alert.position-fixed');
    if (alert) {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }
  }, 3000);
}

// ============================================
// HANDLE FORM SUBMISSION WITH LOADING
// ============================================

function handleFormSubmit(formId) {
  const form = document.getElementById(formId);

  if (form) {
    form.addEventListener('submit', function () {
      showLoading();
    });
  }
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      showNotification('Copied to clipboard!', 'success');
    })
    .catch(function (err) {
      console.error('Failed to copy:', err);
      showNotification('Failed to copy', 'danger');
    });
}

// ============================================
// PRINT PAGE
// ============================================

function printPage() {
  window.print();
}

// ============================================
// EXPORT UTILITIES (for other scripts)
// ============================================

window.GyanvixUtils = {
  confirmAction,
  formatCurrency,
  formatDate,
  showLoading,
  hideLoading,
  showNotification,
  copyToClipboard,
  printPage,
};

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log('%c🏢 Gyanvix Employee Management System', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cVersion 1.0.0', 'color: #6c757d; font-size: 14px;');
console.log('%cDeveloped with ❤️ for efficient employee management', 'color: #6c757d; font-size: 12px;');
