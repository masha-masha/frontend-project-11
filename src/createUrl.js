export default (rss) => {
  const url = new URL('https://allorigins.hexlet.app/get?disableCache=true');
  url.searchParams.set('url', rss);
  return url;
};
