/**
 * Created by meathill on 2017/2/25.
 */

const webpack = require('webpack');
const config = require('./webpack.config');
const build = require('./config/build');

config.watch = config.devtool = false;
config.output.filename = '[name].min.js';
config.plugins = [
  new webpack.DefinePlugin(build)
];

module.exports = config;