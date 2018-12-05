const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      // CSS / SASS / SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // style-loader ou fichier
          MiniCssExtractPlugin.loader,
          // Chargement du CSS
          'css-loader'
        ],
      },
    ]
  }
});
