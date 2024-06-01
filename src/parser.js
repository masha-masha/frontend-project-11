export default (data) => {
  const parser = new DOMParser();
  const htmlRSS = parser.parseFromString(data, 'text/xml');
  const error = htmlRSS.querySelector('parsererror');
  if (error) {
    return false;
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
