const gulp = require('gulp');
const del = require('del');
const useref = require('gulp-useref');
const webserver = require('gulp-webserver');
const http = require('http');
const filesExist = require('files-exist');
const uglify = require('gulp-uglify');
const hashsrc = require("gulp-hash-src");

var localServer = 'http://localhost:8000';

function clean() {
    return del(['dist']);
}

function vendor() {
    return gulp.src(filesExist('node_modules/jquery/dist/jquery.min.js'))
        .pipe(gulp.dest('dist/js/vendor/jquery'));
}

function bundle() {
    return gulp.src('wwwroot/index.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
}

function minify() {
    return gulp.src('dist/js/*.js').
        pipe(uglify()).
        pipe(gulp.dest('dist/js'));
}

function cachebust() {
    return gulp.src("dist/*.html")
      .pipe(hashsrc({build_dir:"dist", src_path:"js", exts:[".js"], query_name:"h"}))
      .pipe(hashsrc({build_dir:"dist", src_path:"css", exts:[".css"], query_name:"h"}))
      .pipe(gulp.dest("dist"));
  };

function serve() {
    return gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            middleware: function (req, res, next) {
                if (/_kill_\/?/.test(req.url)) {
                    res.end();
                    stream.emit('kill');
                }
                next();
            }
        })
    )
}

function shutdown(cb) {
    http.request(localServer + '/_kill_').on('close', cb).end();
}

exports.default = gulp.series(clean, bundle, minify, vendor, cachebust);
exports.serve = serve;
exports.shutdown = shutdown;
exports.clean = clean;