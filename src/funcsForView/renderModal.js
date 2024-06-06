export default (modalElements, state) => {
  const curIndex = state.curPostforModal;
  const findPostinPosts = state.posts.find(({ id }) => id === curIndex);
  const { title, description, link } = findPostinPosts;
  modalElements.title.textContent = title;
  modalElements.body.textContent = description;
  modalElements.openButton.href = link;
};
