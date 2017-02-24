/**
 * Created by realm on 2017/2/21.
 */
const path = require('path');

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
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules|dist/,
    poll: 1000
  },
  resolve: {
    alias: {
      config: {
        DEBUG: true
      }
    }
  }
};