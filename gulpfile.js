var gulp = require("gulp"); // Подключаем gulp.
var sass = require("gulp-sass"); // Подключаем sass пакет.
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var run = require("run-sequence");


gulp.task("style", function() { // Создаем таск style.
    gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sass()) // Преобразуем sass в css посредством gulp-sass.
        .pipe(gulp.dest("source/css")) // Выгружаем результата в папку source/css.
        .pipe(server.stream());
});


gulp.task("serve", function() {
    server.init({
        server: "source/",
        index: "index.html",
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.{scss,sass}", ["style"]); // Наблюдение за sass файлами.
    gulp.watch("source/*.html", ["html"])
        .on("change", server.reload);
});


gulp.task("html", function() {
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("source"));
});


gulp.task("sprite", function() {
    return gulp.src("source/img/svg/icon-*.svg") // Указываем с какими файлами будем работать.
        .pipe(svgstore({ // Запускаем плагин svgstore, т.е. передаем все img, которые будут. найдены.
            inlineSvg: true // Все ненужные xml вырезаются.
        }))
        .pipe(rename("sprite.svg")) // Переименовываем результат в sprite.svg.
        .pipe(gulp.dest("source/img/svg")); // Выгружаем результат в эту папку.
});


gulp.task("build", function(done){
    run("style", "sprite", "html", done);
});
