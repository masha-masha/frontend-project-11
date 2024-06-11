export default (data) => {
  const parser = new DOMParser();
  const htmlRSS = parser.parseFromString(data, 'text/xml');
  const parsererror = htmlRSS.querySelector('parsererror');
  if (parsererror) {
    const error = new Error('invalidRSS');
    throw error;
  }
  const feed = {
    title: htmlRSS.querySelector('title').textContent,
    description: htmlRSS.querySelector('description').textContent,
  };
  console.log(feed);
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
