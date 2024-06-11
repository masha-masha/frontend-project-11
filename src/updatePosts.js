import axios from 'axios';
import _ from 'lodash';
import createUrl from './createUrl.js';
import parser from './parser.js';

const updatePosts = (state) => {
  state.feeds.map(({ link }) => axios.get(createUrl(link))
    .then((response) => {
      const data = response.data.contents;
      const { posts } = parser(data);

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

  setTimeout(() => updatePosts(state), 5000);
};
export default updatePosts;
