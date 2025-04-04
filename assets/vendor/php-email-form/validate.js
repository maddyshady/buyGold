
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();
      let thisForm = this;

      let action = "https://backend.aslikahani.com/purity/v1/leads/construction/submit";

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      const full_name = thisForm.querySelector('[name="full_name"]').value.trim();
      const phone_number = thisForm.querySelector('[name="phone_number"]').value.trim();
      const email = thisForm.querySelector('[name="email"]').value.trim();
      const pincode = thisForm.querySelector('[name="pincode"]').value.trim();

      if (!full_name || !phone_number || !email || !pincode) {
        return displayError(thisForm, "All fields are required.");
      }

      if (!/^\d{10}$/.test(phone_number)) {
        return displayError(thisForm, "Enter a valid 10-digit phone number.");
      }

      if (!/^\d{6}$/.test(pincode)) {
        return displayError(thisForm, "Enter a valid 6-digit pincode.");
      }

      const payload = {
        full_name,
        phone_number: Number(phone_number),
        email,
        pincode: Number(pincode)
      };

      fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          thisForm.querySelector('.loading').classList.remove('d-block');
          if (response.ok) {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
          } else {
            throw new Error("Failed to submit");
          }
        })
        .catch(error => {
          displayError(thisForm, `Submission failed: ${error.message}`);
        });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').textContent = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();

