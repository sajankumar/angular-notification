var gulp = require('gulp'),
    less = require('gulp-less'),
    minifyJs = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    pump = require('pump'),
    karma = require('karma').Server,
    sourcemaps = require('gulp-sourcemaps'),
    docs = require('gulp-ngdocs'),
    rename = require('gulp-rename');


var devTasks = { 
    lessProcess: function () {
        return gulp.src('./src/build.less')
        .pipe(less())
        .pipe(gulp.dest('./src/css'))

    },
    watchLess: function () {
        gulp.watch('./src/*.less', ['build:less', 'dev:css']);
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
        gulp.watch('./src/*.js', ['dev:js']);
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
    .pipe(gulp.dest('./example/js'));
});
/* dev */
gulp.task('dev', ['watch:less', 'watch:js', 'deploy:dev']);
gulp.task('deploy:dev', ['dev:move:js', 'dev:move:css'], devTasks.lessProcess);


/*production build */
gulp.task('prod:compressJS', prodTasks.compressJS);
gulp.task('prod:cleanCss', prodTasks.cleanCss);
gulp.task('prod:docs', prodTasks.generateDocs);
gulp.task('production', ['prod:compressJS', 'build:less', 'prod:docs', 'prod:cleanCss']);