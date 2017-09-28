"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");

gulp.task("to-es5", () => gulp.src("./src/WAY_Core.js")
    .pipe(babel())
    .pipe(gulp.dest("./game/js/plugins/")));
