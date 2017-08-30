// Импортируем установленные модули
const fs = require('fs');
const Express = require('express');
const app = Express();
// Импортируем наш сервис
const { getTopStoriesIds, fetchTopStories } = require('./services');

// Записываем шаблон в строку
const template = fs.readFileSync('./index.html', 'utf8');

// Функция для отрисовки новости
function renderStory({ url, title, by, time }) {
  return `
<li class="story">
  <a href="${url}" class="story" target="_blank">${title}</a>
  <div class="story__details">by ${by} | ${new Date(time * 1000).toLocaleString()}</div>
</li>
`;
}

// Задаем обрабатчик HTTP запроса
app.get('/', async (req, res) => {
  try {
    // Ожидаем получение топ 10 новостей
    const topIds = await getTopStoriesIds(10);
    // Ожидаем получение информации о новостях
    const items = await fetchTopStories(topIds);
    // Отрисовываем их в строки
    const stories = items.map(renderStory);

    // Задаем время актуальности запроса
    res.setHeader('Cache-Control', 'public, max-age=100');
    res.setHeader('Expires', new Date(Date.now() + 100).toUTCString());
    // Заменяем нашу метку на строки и отправляем ответ
    res.end(template.replace('<!--STORIES-->', stories.join('\n')));
  } catch (error) {
    // Обрабатываем ошибку, если что-то не так
    console.error(error.stack);
    res.status(500).send('Something broke!');
  }
});

const port = process.env.NODE_PORT || 9191;

// Запускаем сервер
app.listen(port, () => {
  console.log(`Served from http://localhost:${port}`);
});
