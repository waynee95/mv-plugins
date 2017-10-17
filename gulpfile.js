'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

const paths = {
    src: './src/*',
    pluginFolder: './game/js/plugins/',
    dist: './dist'
};

gulp.task('to-es5', () =>
    gulp.src(paths.src)
        .pipe(changed(paths.src))
        .pipe(babel())
        .pipe(gulp.dest(paths.pluginFolder)));

gulp.task('build', () =>
    gulp.src(paths.src)
        .pipe(babel())
        .pipe(gulp.dest(paths.dist)));
