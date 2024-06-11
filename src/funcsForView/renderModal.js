export default (modalElements, state) => {
  const curIndex = state.currentModalPost;
  const findPostInPosts = state.posts.find(({ id }) => id === curIndex);
  const { title, description, link } = findPostInPosts;
  modalElements.title.textContent = title;
  modalElements.body.textContent = description;
  modalElements.openButton.href = link;
};
