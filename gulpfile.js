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
const replace = require('gulp-replace');
const event = require('event-stream');
const del = require('del');
const marked = require('marked');
const DEST = 'build/';
const DOC = 'docs/';
const CDN = require('./cdn.json');

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
  let path = ['./dist/tqb-city-picker.bundle.js', './dist/dev.bundle.js'];
  return Promise.all(path.map( path => {
    return removeSourceMap(path)
  }));
});

gulp.task('clear', () => {
  return del([DEST, DOC]);
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
    .pipe(webpack(require('./webpack.config.build')))
    .pipe(uglify())
    .pipe(gulp.dest(DEST + 'js/'));
});

gulp.task('html', () => {
  let readme = marked(fs.readFileSync('./README.md', 'utf8'));
  return gulp.src('./index.dev.html')
    .pipe(replace(/node_modules\/([\w]+)\/(dist\/)?/g, (match, repo) => {
      return CDN[repo];
    }))
    .pipe(replace('"dist/', '"js/'))
    .pipe(replace('bundle.js', 'min.js'))
    .pipe(replace('screen.css', 'tqb-city-picker.min.css'))
    .pipe(replace(/<section id="static-sample">[\S\s]+?<\/section>/, ''))
    .pipe(replace('<!-- readme -->', readme))
    .pipe(replace('lang-html', 'lang-html language-html'))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(DOC));
});

gulp.task('copy', () => {
  return event.merge(
    gulp.src('build/**').pipe(gulp.dest(DOC)),
    gulp.src(['css/sample.css']).pipe(gulp.dest(DOC + 'css/')),
    gulp.src('assets/*.json').pipe(gulp.dest(DOC + 'assets'))
  );
});

gulp.task('default', callback => {
  sequence('clear',
    ['stylus', 'webpack', 'html'],
    'copy',
    callback
  );
});