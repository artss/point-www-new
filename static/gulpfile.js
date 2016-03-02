var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var browserify = require('gulp-browserify');
var aliasify = require('aliasify');
//var concat = require('gulp-concat');

var browserifyOptions = {
    debug: true,
    paths: [
        './js',
        './node_modules'
    ],
    transform: [
        babelify.configure({
            presets: ['es2015']
        }),
        aliasify.configure({
            aliases: {
                underscore: './node_modules/lodash/dist/lodash.underscore.js',
                jquery: './js/lib/jquery-dummy.js'
            }
        })
    ]
};

gulp.task('js', function () {
    return gulp.src(['js/main.js', 'js/landing.js'])
        .pipe(sourcemaps.init())
        .pipe(browserify(browserifyOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

