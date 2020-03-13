const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'production';

let SENTRY_DSN = '';
if (fs.existsSync('/run/secrets/sentry_dsn')) {
  SENTRY_DSN = fs.readFileSync('/run/secrets/sentry_dsn', 'utf8').trim();
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@port-of-mars/shared', path.resolve('../shared'));
    config.resolve.alias.set('@port-of-mars/client', path.resolve('./src'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));

    config
      .plugin('define-env')
      .use(webpack.DefinePlugin, [{
        'process.env.SERVER_URL_WS':
          JSON.stringify(['development', 'staging'].includes(NODE_ENV) ? 'ws://localhost:2567' : ''),
        'process.env.SERVER_URL_HTTP':
          JSON.stringify(['development', 'staging'].includes(NODE_ENV) ? 'http://localhost:2567' : ''),
        'process.env.SENTRY_DSN': JSON.stringify(SENTRY_DSN),
      }])
  }
};

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/stylesheets/utilities/_mixins.scss'),
        path.resolve(__dirname, './src/stylesheets/utilities/_variables.scss')
      ]
    });
}
