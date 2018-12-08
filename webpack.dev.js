const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const host = 'localhost';
const port = 3000;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      // CSS / SASS / SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // style-loader ou fichier
          'style-loader',
          // Chargement du CSS
          'css-loader'
        ],
      },
    ]
  },
  devServer: {
    overlay: true, // Overlay navigateur si erreurs de build
    stats: 'minimal', // Infos en console limitées
    progress: true, // progression du build en console
    inline: true, // Rechargement du navigateur en cas de changement
    open: false, // on n'ouvre pas le navigateur automatiquement
    historyApiFallback: true,
    host: host,
    port: port,
  }
});
