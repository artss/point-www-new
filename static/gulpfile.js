'use strict';

var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('gulp-browserify');
var aliasify = require('aliasify');
var twigify = require('twigify');
var minify = require('gulp-minify');

var templatesDir = '../templates';

var browserifyOptions = {
    debug: true,

    paths: [
        './js',
        './node_modules',
        templatesDir
    ],

    exclude: ['jquery'],

    shim: {
        underscore: {
            path: './node_modules/lodash',
            exports: '_'
        }
    },

    transform: [
        babelify.configure({
            presets: ['es2015']
        }),

        twigify.configure({
            extension: /\.(html)$/,
            templatesDir: templatesDir
        })

        /*aliasify.configure({
            aliases: {
                //underscore: './node_modules/lodash/dist/lodash.underscore.js'
            },
            replacements: {
                '\\/base\\.html': '../templates/_base.html'
            }
        })*/
    ]
};

gulp.task('js:main', function () {
    return gulp.src(['js/main.js'])
        .pipe(browserify(browserifyOptions))
        .pipe(minify())
        .pipe(gulp.dest('dist'));
});

gulp.task('js:landing', function () {
    return gulp.src(['js/landing.js'])
        .pipe(browserify(browserifyOptions))
        //.pipe(minify())
        .pipe(gulp.dest('dist'));
});

