'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const connect = require('gulp-connect');
const open = require('gulp-open');

const paths = {
    game: './game',
    index: './game/index.html',
    src: './src/**/*.js',
    plugins: './game/js/plugins/',
    dist: './dist'
};

gulp.task('to-es5', () => {
    gulp.src(paths.src)
        .pipe(changed(paths.src))
        .pipe(babel())
        .pipe(gulp.dest(paths.plugins));
});

gulp.task('build', () => {
    gulp.src(paths.src)
        .pipe(babel())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('webserver', () => {
    connect.server({
        root: paths.game,
        port: 8888,
        livereload: true,
        fallback: paths.index
    });
    gulp.src('').pipe(open({ app: 'firefox', uri: 'http://localhost:8888' }));
});
