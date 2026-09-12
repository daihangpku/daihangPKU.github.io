'use strict';

const form = document.querySelector('#contact-form');
if (form) {
  const button = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#form-status');
  let submitting = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission failed');
      status.dataset.state = 'success';
      status.textContent = 'Thank you! Your message has been sent.';
      form.reset();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = 'Your message could not be sent. Please try again or email me directly.';
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.textContent = 'Send message';
      form.removeAttribute('aria-busy');
    }
  });
}
