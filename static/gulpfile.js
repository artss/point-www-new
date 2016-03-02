var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var browserify = require('gulp-browserify');
//var concat = require('gulp-concat');

gulp.task('default', function () {
    return gulp.src('src/a.js')
        .pipe(sourcemaps.init())
        .pipe(browserify({
            transform: [babelify.configure({presets: ['es2015']})]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

