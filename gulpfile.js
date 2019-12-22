'use strict';

var gulp = require('gulp');
const eslint = require('gulp-eslint');
var jest = require('gulp-jest').default;

gulp.task('lint', function() {
  return gulp
    .src(['src/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function() {
  return gulp.src('__tests__').pipe(
    jest({
      preprocessorIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
      ],
      automock: false,
    })
  );
});

gulp.task('testmonitor', function() {
  gulp.watch('src/*.js', gulp.series('test'));
});
