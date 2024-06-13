const renderFeeds = (container, feeds, i18n) => {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18n.t('feeds');
  cardBody.append(h2);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(h3, p);
    ul.append(li);
  });
  cardWrapper.append(cardBody, ul);
  container.replaceChildren(cardWrapper);
};
const renderPosts = (postsElements, posts, state, i18n) => {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18n.t('posts');
  cardBody.append(h2);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    if (state.visitedPosts.includes(post.id)) {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.id = post.id;
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.id = post.id;
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('button');

    li.append(a, button);
    ul.append(li);
  });
  cardWrapper.append(cardBody, ul);
  postsElements.replaceChildren(cardWrapper);
};
const renderModal = (modalElements, state) => {
  const curIndex = state.currentModalPost;
  const findPostInPosts = state.posts.find(({ id }) => id === curIndex);
  const { title, description, link } = findPostInPosts;
  modalElements.title.textContent = title;
  modalElements.body.textContent = description;
  modalElements.openButton.href = link;
};
const handleStatus = (input, feedback, button, value, i18n, state) => {
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
    case 'error':
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = i18n.t(`${state.error}`);
      button.disabled = false;
      break;
    case 'sending':
      button.disabled = true;
      break;
    default:
      break;
  }
};

export default (elements, i18n, state) => (path, value) => {
  const { feeds, posts } = elements.content;
  const { feedback, input, button } = elements.basicElements;
  switch (path) {
    case 'feeds':
      renderFeeds(feeds, state.feeds, i18n);
      break;
    case 'posts':
      renderPosts(posts, state.posts, state, i18n);
      break;
    case 'currentModalPost':
      renderModal(elements.modalElements, state);
      break;
    case 'status':
      handleStatus(input, feedback, button, value, i18n, state);
      break;
    default:
      break;
  }
};
