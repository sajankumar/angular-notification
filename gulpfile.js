var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyJs = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    pump = require('pump'),
    karma = require('karma').Server,
    sourcemaps = require('gulp-sourcemaps');

var devTasks = { 
    sassProcess: function () {
        return gulp.src('./src/build.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
    },
    watchSass: function () {
        gulp.watch('./src/*.scss', ['build:sass']);
    },
    unitTest: function (done) {
        new karma({
            configFile: __dirname + '/karma.conf.js',
        }, done).start();
    }

};

var prodTasks = {
    compressJS: function (cb) {
        pump([
            gulp.src('./src/*.js'),
            minifyJs(),
            gulp.dest('dist')
        ]),
        cb();
    },
    cleanCss: function () {
        return gulp.src('./src/css/build.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
    }
};
gulp.task('watch:sass', devTasks.watchSass);
gulp.task('build:sass', devTasks.sassProcess);
gulp.task('karma:single', devTasks.unitTest);

/* dev */
gulp.task('deploy:dev', ['watch:sass', 'karma:single']);

/*production build */
gulp.task('prod:compressJS', prodTasks.compressJS);
gulp.task('prod:cleanCss', prodTasks.cleanCss);

gulp.task('production', ['build:sass', 'prod:cleanCss', 'prod:compressJS']);

