'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var twigify = require('twigify');
var minify = require('gulp-minify');

var templatesDir = '../templates';
var buildDir = './dist';

var browserifyOptions = {
    debug: true,

    paths: [
        './js',
        './node_modules',
        templatesDir
    ],

    exclude: ['jquery']
};

['main', 'landing'].forEach(function (entry) {
    gulp.task('js:' + entry, function () {
        return browserify('./js/' + entry + '.js', browserifyOptions)
            .transform('babelify', {presets: ['es2015']})
            .transform('aliasify', {aliases: {underscore: 'lodash'}})
            .transform('twigify', {
                extension: /\.(html)$/,
                templatesDir: templatesDir
            })
            .bundle()
            .pipe(source(entry + '.js'))
            .pipe(minify())
            .pipe(gulp.dest(buildDir));
    });
});
