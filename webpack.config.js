/**
 * Created by realm on 2017/2/21.
 */
const path = require('path');
const webpack = require('webpack');
const dev = require('./config/dev');

module.exports = {
  entry: {
    'tqb-city-picker': './app/main.js',
    dev: './app/dev.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
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
  devtool: "source-map",
  watch: true,
  watchOptions: {
    ignored: /node_modules|dist|styl|css|docs|img/,
    poll: 1000
  },
  plugins: [
    new webpack.DefinePlugin(dev)
  ]
};