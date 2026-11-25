const menu = document.querySelector('.menu');
const nav = document.querySelector('.navlinks');

menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');

    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.textContent = open ? '✕' : '☰';
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open menu');
        menu.textContent = '☰';
    });
});


// Set the current year automatically in the footer
document.getElementById('year').textContent = new Date().getFullYear();


// Formspree contact form
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const emailField = document.getElementById('email');

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    // Use the visitor's email as the reply-to address
    formData.set('_replyto', emailField.value);

    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending...';

    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Clear all form fields
            contactForm.reset();

            // Show success message without leaving the page
            formStatus.textContent =
                'Thank you. Your enquiry has been sent successfully.';

            formStatus.classList.add('success');
        } else {
            let data = {};

            try {
                data = await response.json();
            } catch (error) {
                // Ignore JSON parsing errors and use the generic message below
            }

            if (data.errors) {
                formStatus.textContent =
                    data.errors.map(error => error.message).join(', ');
            } else {
                formStatus.textContent =
                    'Something went wrong. Please try again.';
            }

            formStatus.classList.add('error');
        }
    } catch (error) {
        formStatus.textContent =
            'Something went wrong. Please check your connection and try again.';

        formStatus.classList.add('error');
    }

    submitButton.disabled = false;
    submitButton.innerHTML =
        'Send enquiry <span aria-hidden="true">↗</span>';
});