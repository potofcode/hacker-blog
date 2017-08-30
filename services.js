require('isomorphic-fetch');
// Т.к. у нас установлен node 8+ то можем использовать async/await,
// что делает код более читабельным и линейным, нежели лапша из `Promise.then`.

async function getTopStoriesIds(count) {
// Здесь используется URL `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`,
// который возвращает массив из числовых значений топ новостей, где мы получам `count` первых значений.

  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
  const ids = await response.json();
  return ids.slice(0, count);
}

async function fetchTopStories(ids) {
// Здесь мы получем информацию о каждой новости по ее номеру
// через URL `https://hacker-news.firebaseio.com/v0/item/${id}.json`.

  return Promise.all(ids.map(async id => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return response.json();
  }));
}

module.exports = {
  getTopStoriesIds,
  fetchTopStories,
};