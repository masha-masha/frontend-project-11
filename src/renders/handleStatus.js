export default (input, feedback, button, value, i18n, state) => {
  switch (value) {
    case 'success':
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger', 'text-success');
      feedback.classList.add('text-success');
      input.value = '';
      input.focus();
      feedback.textContent = i18n.t('validRSS');
      button.disabled = false;
      break;
    case 'errors':
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = i18n.t(`${state.errors}`);
      button.disabled = false;
      break;
    case 'sending':
      button.disabled = true;
      break;
    default:
      break;
  }
};
