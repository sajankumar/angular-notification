var gulp = require('gulp'),
    less = require('gulp-less'),
    minifyJs = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    pump = require('pump'),
    karma = require('karma').Server,
    sourcemaps = require('gulp-sourcemaps'),
    docs = require('gulp-ngdocs'),
    rename = require('gulp-rename'),
    sequence = require('gulp-sequence')

var devTasks = { 
    lessProcess: function () {
        return gulp.src('./src/build.less')
        .pipe(less())
        .pipe(gulp.dest('./src/css'))

    },
    watchLess: function () {
        gulp.watch('./src/*.less', function (event) { 
            sequence('build:less', 'dev:css', 'dev:move:css') (function (err) {
                if(err) {
                    console.log('err:', err);
                }
            });
        });
    },
    unitTest: function (done) {
        new karma({
            configFile: __dirname + '/karma.conf.js',
        }, done).start();
    },
    css: function () {
        return gulp.src('./src/css/build.css')
        .pipe(rename('riNotification.css'))
        .pipe(gulp.dest('dist'));
    },
    watchjs: function () {
        gulp.watch('./src/*.js', function (event) {
            sequence('dev:js', 'dev:move:js') (function (err) {
                if(err) {
                    console.log('err:', err);
                }
            });
        });
    },
    js: function () {
        return gulp.src('./src/riNotification.js')
        .pipe(gulp.dest('dist'));
    }

};

var prodTasks = {
    compressJS: function (cb) {
        pump([
            gulp.src('./src/riNotification.js'),
            minifyJs(),
            rename({suffix: '.min'}),
            gulp.dest('dist')
        ]),
        cb();
    },
    cleanCss: function () {
        return gulp.src('./src/css/build.css')
        .pipe(minifyCss())
        .pipe(rename('riNotification.min.css'))
        .pipe(gulp.dest('dist'));
    },
    generateDocs: function () {
        return gulp.src('./src/riNotification.js')
        .pipe(docs.process({html5Mode: false}))
        .pipe(gulp.dest('./docs'));
    }
   
};
gulp.task('watch:less', devTasks.watchLess);
gulp.task('build:less', devTasks.lessProcess);
gulp.task('dev:css', devTasks.css);
gulp.task('dev:js', devTasks.js);
gulp.task('karma:single', devTasks.unitTest);
gulp.task('watch:js', devTasks.watchjs);

gulp.task('dev:move:js', function () {
    return gulp.src('./dist/riNotification.js')
    .pipe(gulp.dest('./example/js'));
});
gulp.task('dev:move:css', function () {
    return gulp.src('./dist/riNotification.css')
    .pipe(gulp.dest('./example/css'));
});
/* dev */
gulp.task('dev:build', sequence('build:less', 'dev:css', 'dev:js', 'dev:move:js', 'dev:move:css'));
gulp.task('dev', ['watch:less', 'watch:js']);

/*production build */
gulp.task('prod:compressJS', prodTasks.compressJS);
gulp.task('prod:cleanCss', prodTasks.cleanCss);
gulp.task('prod:docs', prodTasks.generateDocs);
gulp.task('production', sequence('prod:compressJS', 'build:less', 'prod:docs', 'prod:cleanCss'));