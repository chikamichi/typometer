const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production';
const host = 'localhost';
const port = 3000;

module.exports = {
  mode: 'development',
  entry: [
    'typometer.ts',
    'assets/stylesheets/theme.css',
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre"
      },
      // CSS / SASS / SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // style-loader ou fichier
          devMode ? 'style-loader' :
            MiniCssExtractPlugin.loader,
          // Chargement du CSS
          'css-loader'
        ],
      },
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
      new TsConfigPathsPlugin()
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    overlay: true, // Overlay navigateur si erreurs de build
    stats: 'minimal', // Infos en console limitées
    progress: true, // progression du build en console
    inline: true, // Rechargement du navigateur en cas de changement
    open: true, // on ouvre le navigateur
    historyApiFallback: true,
    host: host,
    port: port,
  },
  plugins: [
    new CheckerPlugin(),
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
