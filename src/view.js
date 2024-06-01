import renderFeeds from './renders/renderFeeds.js';
import renderPosts from './renders/renderPosts.js';
import rendersErrors from './renders/rendersErrors.js';

export default (elements, i18n, state) => (path) => {
  switch (path) {
    case 'feeds':
      renderFeeds(elements.content.feeds, state.feeds);
      break;
    case 'posts':
      renderPosts(elements.content.posts, state.posts, state, i18n);
      break;
    case 'errors':
      rendersErrors(elements.basicElements.input, elements.basicElements.feedback, i18n, state);
      break;
    default:
      break;
  }
};
