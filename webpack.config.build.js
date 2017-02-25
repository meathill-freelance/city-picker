/**
 * Created by meathill on 2017/2/25.
 */

const path =require('path');
const config = require('./webpack.config');

config.watch = false;
config.output.filename = '[name].min.js';
config.resolve.alias.config = path.resolve(__dirname, './config/build.js');

module.exports = config;