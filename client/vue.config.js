const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'production';

let SENTRY_DSN = '';
if (fs.existsSync('/run/secrets/sentry_dsn')) {
  SENTRY_DSN = fs.readFileSync('/run/secrets/sentry_dsn', 'utf8').trim();
}

module.exports = {
  configureWebpack: {
    // https://webpack.js.org/configuration/devtool/
    // disable source maps in staging and prod
    devtool: NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : 'none'
  },
  chainWebpack: (config) => {
    // get around CSP error on safari https://github.com/vuejs/vue-cli/issues/1074
    config.plugins
      .delete('split-manifest')
      .delete('inline-manifest');
    config.resolve.alias.set(
      '@port-of-mars/shared',
      path.resolve('../shared/src')
    );
    config.resolve.alias.set('@port-of-mars/client', path.resolve('./src'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) =>
      addStyleResource(config.module.rule('scss').oneOf(type))
    );

    config.plugin('define-env').use(webpack.DefinePlugin, [
      // local development workarounds to set URLs for the server
      // in staging and prod this doesn't matter, leave as empty string
      {
        'process.env.SERVER_URL_WS': JSON.stringify(
          ['development'].includes(NODE_ENV) ? 'ws://localhost:2567' : ''
        ),
        'process.env.SERVER_URL_HTTP': JSON.stringify(
          ['development'].includes(NODE_ENV) ? 'http://localhost:2567' : ''
        ),
        'process.env.SENTRY_DSN': JSON.stringify(SENTRY_DSN),
      },
    ]);
  },
};

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/stylesheets/utilities/_mixins.scss'),
        path.resolve(__dirname, './src/stylesheets/utilities/_variables.scss'),
        path.resolve(
          __dirname,
          './src/stylesheets/utilities/color-palette.scss'
        ),
      ],
    });
}
