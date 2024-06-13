import axios from 'axios';
import _ from 'lodash';

export const createUrl = (rss) => {
  const url = new URL('https://allorigins.hexlet.app/get?disableCache=true');
  url.searchParams.set('url', rss);
  return url;
};

export const getParsedData = (data) => {
  const parser = new DOMParser();
  const htmlRSS = parser.parseFromString(data, 'text/xml');
  const parsererror = htmlRSS.querySelector('parsererror');
  if (parsererror) {
    const error = new Error('invalidRSS');
    error.data = parsererror.textContent;
    throw error;
  }
  const feed = {
    title: htmlRSS.querySelector('title').textContent,
    description: htmlRSS.querySelector('description').textContent,
  };
  const items = htmlRSS.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    return post;
  });

  return { feed, posts };
};
export const updatePosts = (state) => {
  const promises = state.feeds.map(({ link }) => axios.get(createUrl(link))
    .then((response) => {
      const data = response.data.contents;
      const { posts } = getParsedData(data);

      posts.forEach((curPost) => {
        const alreadyAdded = state.posts
          .some((prevPost) => prevPost.title === curPost.title);
        if (!alreadyAdded) {
          state.posts.unshift({ ...curPost, id: _.uniqueId() });
        }
      });
    })
    .catch((error) => {
      throw error;
    }));

  Promise.all(promises)
    .finally(() => {
      setTimeout(() => updatePosts(state), 5000);
    });
};
