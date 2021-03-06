const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: [
    'src/index.ts',
    'assets/stylesheets/theme.css',
  ],
  module: {
    rules: [
      // TypeScript / JavaScript
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /webpack/
        ]
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
        exclude: [
          /node_modules/,
        ]
      },

      // CSS / SASS / SCSS
      // Specified environment-wise

      // Fonts
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
    }),
    // Permet d'exporter les styles CSS dans un fichier css de dist/
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ]
};
