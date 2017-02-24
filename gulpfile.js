/**
 * Created by meathill on 2017/2/23.
 */

const fs = require('fs');
const gulp = require('gulp');
const sequence = require('run-sequence');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const base64 = require('gulp-base64');
const webpack = require('gulp-webpack');
const uglify = require('gulp-uglify');
const del = require('del');
const DEST = 'build/';

let removeSourceMap = function (path) {
  return new Promise(resolve => {
    fs.readFile(path, 'utf8', (err, content) => {
      if (err) {
        throw err;
      }
      resolve(content);
    });
  })
    .then(content => {
      content = content.replace(/\/\/# sourceMappingURL\S*/gi, '');
      return new Promise(resolve => {
        fs.writeFile(path, content, 'utf8', err => {
          if (err) {
            throw err;
          }
          resolve();
        });
      })
    });
};
gulp.task('sourcemap', () => {
  let path = ['./dist/city-picker.bundle.js', './dist/dev.bundle.js'];
  return Promise.all(path.map( path => {
    return removeSourceMap(path)
  }));
});

gulp.task('clear', () => {
  return del(DEST);
});

gulp.task('stylus', () => {
  return gulp.src('./styl/screen.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(cleanCSS())
    .pipe(base64())
    .pipe(rename('tqb-city-picker.min.css'))
    .pipe(gulp.dest(DEST + 'css/'));
});

gulp.task('webpack', () => {
  return gulp.src('./app/main.js')
    .pipe(webpack(require('./webpack.config')))
    .pipe(uglify())
    .pipe(rename('tqb-city-picker.min.js'))
    .pipe(gulp.dest(DEST + 'js/'));
});

gulp.task('default', callback => {
  sequence('clear',
    ['stylus', 'webpack'],
    callback
  );
});