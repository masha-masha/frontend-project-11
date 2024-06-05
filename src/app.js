import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import view from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';
import createUrl from './createUrl.js';
import updatePosts from './updatePosts.js';

export default async () => {
  const defaultLang = 'ru';

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });
  const initialState = {
    status: '',
    errors: '',
    links: [],
    feeds: [],
    posts: [],
    alreadyVisit: [],
    curPostforModal: '',
  };
  const elements = {
    basicElements: {
      input: document.querySelector('input'),
      form: document.querySelector('form'),
      feedback: document.querySelector('p.feedback'),
      button: document.querySelector('button[aria-label="add"]'),
    },
    content: {
      posts: document.querySelector('div.posts'),
      feeds: document.querySelector('div.feeds'),
    },
    modalElements: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      openButton: document.querySelector('.full-article'),
      closeButton: document.querySelector('.btn-secondary'),
    },
  };
  const validateData = (url, existsLinks) => {
    const schema = yup.object().shape({
      url: yup
        .string()
        .url('invalidURL')
        .notOneOf(existsLinks, 'alreadyExists')
        .required(),
    });
    return schema.validate({ url });
  };
  const watchedState = onChange(initialState, view(elements, i18n, initialState));

  elements.basicElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.basicElements.input;
    validateData(value, watchedState.links)
      .then(() => {
        watchedState.status = 'sending';
        return axios.get(createUrl(value));
      })
      .then((response) => {
        const { feed, posts } = parser(response.data.contents);
        watchedState.feeds.push(feed);
        const updatedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts.unshift(...updatedPosts);
        watchedState.links.push(value);
        watchedState.status = 'success';
      })
      .catch((error) => {
        watchedState.status = 'handle';
        let curErr;
        if (error.name === 'AxiosError') {
          curErr = 'networkError';
        } else {
          curErr = error.message;
        }
        watchedState.errors = curErr;
        watchedState.status = 'errors';
      });
  });
  updatePosts(watchedState);

  elements.content.posts.addEventListener('click', (e) => {
    const { tagName } = e.target;
    switch (tagName) {
      case 'A':
      case 'BUTTON':
        watchedState.alreadyVisit.push(e.target.id);
        watchedState.posts = [...watchedState.posts];
        watchedState.curPostforModal = e.target.id;
        break;
      default:
        break;
    }
  });
};
