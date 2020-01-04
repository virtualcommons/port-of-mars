const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('shared', path.resolve('../shared'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));
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
