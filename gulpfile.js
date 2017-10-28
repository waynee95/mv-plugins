'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const cache = require('gulp-cached');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');

const PRODUCTION = false;

const PATH = {
    src: './src/**/',
    build: PRODUCTION ? './dist' : './game/js/plugins/'
};

const browserSyncConfig = {
    server: {
        baseDir: './game'
    }
};

gulp.task('webserver', ['browser-sync', 'watch-folder'], () => {});

gulp.task('watch-folder', () =>
    gulp
        .src(`${PATH.src}*.js`)
        .pipe(sourcemaps.init())
        .pipe(cache('watching'))
        .pipe(watch(PATH.src, { base: PATH.src }, browserSync.reload()))
        .pipe(
            babel({
                presets: ['env', 'airbnb'],
                plugins: ['transform-es2015-parameters']
            })
        )
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(PATH.build))
        .pipe(browserSync.stream())
);

gulp.task('browser-sync', () => {
    browserSync.init(browserSyncConfig);
});

gulp.task('build', () => {
    gulp
        .src(PATH.src)
        .pipe(
            babel({
                presets: ['env', 'airbnb'],
                plugins: ['transform-es2015-parameters']
            })
        )
        .pipe(gulp.dest(PATH.build));
});

gulp.task('clean', () =>
    gulp
        .src('./game/js/plugins/WAY_*')
        .pipe(buffer())
        .pipe(clean({ force: true }))
);
