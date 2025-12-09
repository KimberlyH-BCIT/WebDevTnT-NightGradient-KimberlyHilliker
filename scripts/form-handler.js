// Form handler for signup form

document.addEventListener('DOMContentLoaded', function() {
  const hearSelect = document.getElementById('hear');
  const detailsLabel = document.getElementById('details-label');
  const detailsTextarea = document.getElementById('details');
  
  // Handle conditional display of details textarea
  if (hearSelect && detailsLabel && detailsTextarea) {
    hearSelect.addEventListener('change', function() {
      const value = this.value;
      
      // Show details field for "magic" or "other"
      if (value === 'magic' || value === 'other') {
        detailsLabel.classList.remove('visually-hidden');
        detailsTextarea.classList.remove('visually-hidden');
        detailsTextarea.required = true;
      } else {
        detailsLabel.classList.add('visually-hidden');
        detailsTextarea.classList.add('visually-hidden');
        detailsTextarea.required = false;
        detailsTextarea.value = ''; // Clear the field when hidden
      }
    });
  }
  
  // Handle form submission
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function(e) {
      // Let the form validate naturally
      if (!this.checkValidity()) {
        e.preventDefault();
        // Browser will show validation messages
      }
    });
  }
  
  // Handle reset button
  const resetButton = document.querySelector('button[type="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      // Hide the details field when form is reset
      if (detailsLabel && detailsTextarea) {
        detailsLabel.classList.add('visually-hidden');
        detailsTextarea.classList.add('visually-hidden');
        detailsTextarea.required = false;
      }
    });
  }
});
