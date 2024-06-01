export default (input, feedback, i18n, state) => {
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger', 'text-success');

  if (state.isValid) {
    feedback.textContent = i18n.t('validRSS');
    feedback.classList.add('text-success');
    input.value = '';
    input.focus();
  } else {
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    feedback.textContent = state.errors;
  }
};
