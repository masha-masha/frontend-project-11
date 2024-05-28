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
    links: ['https://lorem-rss.hexlet.app/feed'],
    feed: [],
    posts: [],
  };
  const elements = {
    input: document.querySelector('input'),
    form: document.querySelector('form'),
    feedback: document.querySelector('p.feedback'),
    posts: document.querySelector('div.posts'),
    feeds: document.querySelector('div.feeds'),
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
  const validateData = (link, existsLinks) => {
    const schema = yup.object().shape({
      url: yup
        .string()
        .url()
        .notOneOf(existsLinks)
        .required(),
    });
    return schema.validate({ url: link });
  };
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validateData(value, initialState.links)
      .then(() => axios.get(createUrl(value)))
      .then((res) => {
        const responseData = res.data.contents;
        console.log(parser(responseData));
      })
      .catch((e) => {
        if(e.type === 'url'){
          console.log(i18n.t('invalidRSS'))
        }
        if (e.type === 'notOneOf'){
          console.log(i18n.t('alreadyExist'))
        }
   
  });
  });
};
