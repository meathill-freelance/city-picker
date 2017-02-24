/**
 * Created by meathill on 2017/2/23.
 */

const fs = require('fs');
const gulp = require('gulp');

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

gulp.task('default', callback => {

});