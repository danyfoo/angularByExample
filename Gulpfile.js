var gulp = require('gulp'),
    connect = require('gulp-connect'),
    history = require('connect-history-api-fallback'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream;

// Servidor web de desarrollo
gulp.task('server', function () {
    "use strict";
    connect.server({
        root: 'app',
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true,
        middleware: function (connect, opt) {
            return [history()];
        }
    });
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function () {
    "use strict";
    return gulp.src('./app/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// Pre-procesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function () {
    "use strict";
    gulp.src('./app/stylesheets/main.styl')
        .pipe(stylus({use: nib()}))
        .pipe(gulp.dest('./app/stylesheets'))
        .pipe(connect.reload())
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function () {
    "use strict";
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function(){
    "use strict";
    var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css']);
    return gulp.src('index.html', {cwd: './app'})
        .pipe(inject(sources, {
            //read: false,
            ignorePath: '/app'
        }))
        .pipe(gulp.dest('./app'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function(){
    "use strict";
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/lib'
        }))
        .pipe(gulp.dest('./app'))
})

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function () {
    "use strict";
    gulp.watch(['./app/**/*.html'], ['html']);
    gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
    gulp.watch(['./app/scripts/**/*.js'], ['jshint', 'inject']);
    gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'inject', 'wiredep','watch']);