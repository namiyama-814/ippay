'use strict';

const { Hono } = require('hono');
const { logger } = require('hono/logger');
const { HTTPException } = require('hono/http-exception');
const { secureHeaders } = require('hono/secure-headers');
const { env } = require('hono/adapter');
const { trimTrailingSlash } = require('hono/trailing-slash');
const { serveStatic } = require('@hono/node-server/serve-static');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = new Hono();

app.use(logger());
app.use(secureHeaders());
app.use(trimTrailingSlash());
app.use(serveStatic({ root: './public' }));

// ルーティング
app.route('/', indexRouter);
app.route('/api', apiRouter);

// 404 Not Found
app.notFound((c) => {
  return c.json({
    message: "404 Not Found",
    status: 404
  }, 404)
})

// エラーハンドリング
app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  };

  // 予期せぬエラーログ出力
  console.error(`Unhandled Error: ${error.message}`);

  // クライアントに500エラーを返す
  return c.json({
    success: false,
    message: 'Internal Server Error',
  }, 500)
})

module.exports = app;