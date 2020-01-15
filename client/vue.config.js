const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('shared', path.resolve('../shared'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));

    config
      .plugin('define-env')
      .use(webpack.DefinePlugin, [{
        'process.env.SERVER_URL':
          JSON.stringify(['development', 'staging'].includes(NODE_ENV) ? 'ws://localhost:2567' : 'wss://portofmars.asu.edu')
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
