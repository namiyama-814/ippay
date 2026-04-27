const { Hono } = require('hono');
const pug = require('pug');
const { html } = require('hono/html');
const { readFile } = require('node:fs/promises');

const app = new Hono();

app.get('/', async (c) => {
  const html = await readFile('./views/home.html', 'utf-8')
  return c.html(html)
})

module.exports = app;