const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ul/v1/connect',
    createProxyMiddleware({
      target: 'https://phantom.app',
      changeOrigin: true,
    })
  );
};