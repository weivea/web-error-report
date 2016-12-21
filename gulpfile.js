/**
 * Created by weijianli on 15/12/29.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat')
var rename = require("gulp-rename");


gulp.task('t1',function(){
  gulp.src(['reporter/reporterErr.js'])
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += "_min";

    }))
    .pipe(gulp.dest('public/js/reporter'));
});

gulp.task('t2',function(){
  gulp.src(['reporter/reporter.js','reporter/reporterErr.js'])
    .pipe(concat("reporter_min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/reporter'));
});

gulp.task('wt1',function(){
  gulp.src(['reporter/reporterErr.js'])
    .pipe(rename(function (path) {
      path.basename += "_min";

    }))
    .pipe(gulp.dest('public/js/reporter'));
});

gulp.task('wt2',function(){
  gulp.src(['reporter/reporter.js','reporter/reporterErr.js'])
    .pipe(concat("reporter_min.js"))
    .pipe(gulp.dest('public/js/reporter'));
});

gulp.task('build',['t1','t2']);
gulp.task('default',function () {
  gulp.run('wt1', 'wt2');
  gulp.watch('reporter/*.js', ['wt1', 'wt2']);
});