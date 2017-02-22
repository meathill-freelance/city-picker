/**
 * Created by realm on 2017/2/21.
 */
const path = require('path');
const RemoveSourceMapUrlWebpackPlugin = require('@rbarilani/remove-source-map-url-webpack-plugin');

module.exports = {
  entry: {
    'city-picker': './app/main.js',
    dev: './app/dev.js'
  },
  output: {
    path: 'dist',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      }
    ]
  },
  plugins: [
    new RemoveSourceMapUrlWebpackPlugin({
      test: /\.bundle\.js$/
    })
  ],
  watch: true,
  watchOptions: {
    ignored: /node_modules|dist/,
    poll: 1000
  }
};