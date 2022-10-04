const gulp = require("gulp");
const useref = require("gulp-useref");
const webserver = require("gulp-webserver");
const https = require("https");
const http = require("http");
const filesExist = require("files-exist");
const uglify = require("gulp-uglify");
const hashsrc = require("gulp-hash-src");

var host = "localhost";
var port = 8081;
var isHttps = true;

function clean() {
    return import("del").then((del) => {
        return del.deleteAsync(['dist']);
    });
}

function vendor() {
    return gulp.src(filesExist("node_modules/jquery/dist/jquery.min.js"))
         .pipe(gulp.dest("dist/js/vendor/jquery"));    
}

function vendorV10(){
    return gulp.src(["node_modules/jquery/dist/jquery.min.js", "src/js/weavy-ui/common.js"])
        .pipe(gulp.dest("dist/js/vendor10"));
}

function bundle() {
    return gulp.src("src/index.html")
        .pipe(useref())
        .pipe(gulp.dest("dist"));
}

function bundleV10() {
    return gulp.src("src/index10.html")
        .pipe(useref())
        .pipe(gulp.dest("dist"));
}

function minify() {
    return gulp.src("dist/js/*.js").
        pipe(uglify()).
        pipe(gulp.dest("dist/js"));
}

function cachebust() {
    return gulp.src("dist/*.html")
        .pipe(hashsrc({ build_dir: "dist", src_path: "js", exts: [".js"], query_name: "h" }))
        .pipe(hashsrc({ build_dir: "dist", src_path: "css", exts: [".css"], query_name: "h" }))
        .pipe(gulp.dest("dist"));
};

function serve() {
    var stream = gulp.src("dist")
        .pipe(webserver({
            host: host,
            port: port,
            livereload: true,
            directoryListing: false,
            open: true,
            https: isHttps,
            middleware: function (req, res, next) {
                if (/_kill_\/?/.test(req.url)) {
                    res.end();
                    stream.emit("kill");
                }
                next();
            }
        })
        )
    return stream;
}

function shutdown(cb) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    if (isHttps) {
        return https.request({
            hostname: host,
            port: port,
            path: "/_kill_",
            method: "GET",
            requestCert: false,
            rejectUnauthorized: false
        }).on("close", cb).end();
    } else {
        return http.request("http://" + host + ":" + port.toString() + "/_kill_").on("close", cb).end();
    }
}

function watch() {
    return gulp.watch("src/**/*.*", gulp.series(clean, bundle, bundleV10, minify, vendor, vendorV10, cachebust));
}

exports.default = gulp.series(clean, bundle, bundleV10, minify, vendor, vendorV10, cachebust, watch);
exports.serve = serve;
exports.shutdown = shutdown;
exports.clean = clean;
