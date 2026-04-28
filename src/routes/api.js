const { Hono } = require('hono');

const app = new Hono();

app.get('/', (c) => { return c.json({ message: 'Hello, IPPAY API!' }) });


module.exports = app;