import renderFeeds from './renders/renderFeeds.js';
import renderPosts from './renders/renderPosts.js';
import renderModal from './renders/renderModal.js';
import handleStatus from './renders/handleStatus.js';

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
    case 'curPostforModal':
      renderModal(elements.modalElements, state);
      break;
    case 'status':
      handleStatus(input, feedback, button, value, i18n, state);
      break;
    default:
      break;
  }
};
