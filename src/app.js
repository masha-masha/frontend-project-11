import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import view from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';

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
    isValid: false,
    links: [],
    feeds: [],
    posts: [],
    alreadyVisit: [],
    currentPostId: '',
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
  const createUrl = (rss) => {
    const url = new URL('https://allorigins.hexlet.app/get?disableCache=true');
    url.searchParams.set('url', rss);
    return url;
  };
  yup.setLocale({
    mixed: {
      url: () => ({ key: 'invalidRSS' }),
      notOneOf: () => ({ key: 'alreadyExists' }),
    },
  });
  const validateData = (url, existsLinks) => {
    const schema = yup.object().shape({
      url: yup
        .string()
        .url(i18n.t('invalidRSS'))
        .notOneOf(existsLinks, i18n.t('alreadyExists'))
        .required(),
    });
    return schema.validate({ url });
  };
  const watchedState = onChange(initialState, view(elements, i18n, initialState));

  elements.basicElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.basicElements.input;
    validateData(value, watchedState.links)
      .then(() => axios.get(createUrl(value)))
      .then((response) => {
        const { feed, posts } = parser(response.data.contents);
        watchedState.feeds.push(feed);
        const updatedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts.push(...updatedPosts);
        watchedState.isValid = true;
        watchedState.errors = '';
        watchedState.links.push(value);
      })
      .catch((error) => {
        watchedState.isValid = false;
        watchedState.errors = error.message;
      });
  });
  elements.content.posts.addEventListener('click', (e) => {
    const { tagName } = e.target;
    switch (tagName) {
      case 'A':
        const aId = e.target.id;
        watchedState.alreadyVisit.push(aId);
        watchedState.posts = [...watchedState.posts];
        break;
      case 'BUTTON':
        const buttonId = e.target.id;
        watchedState.alreadyVisit.push(buttonId);
        watchedState.posts = [...watchedState.posts];
        break;
      default:
        break;
    }
  });
};
