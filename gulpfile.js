const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const gulpCopy = require('gulp-copy');
const nodemon = require('gulp-nodemon');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function(cb) {
  return del('dist', cb);
})

gulp.task('copy-static', gulp.series('clean', () => {
  var source = [
    '.env'
    ]
  return gulp.src(source)
    .pipe(gulpCopy('dist/bin'));
}));

gulp.task('run', () => {
  var stream = nodemon({
                 script: './dist/bin/www.js'
            });
  return stream;
});

gulp.task('build', gulp.series('copy-static', () => {
  return tsProject.src().pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
}));

gulp.task('default', gulp.series('build'));