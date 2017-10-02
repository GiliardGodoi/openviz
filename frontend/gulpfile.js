const gulp = require("gulp")
const server = require("gulp-express")
const browserify = require("browserify")
const babelify = require("babelify")
// const sourcemaps = require("gulp-sourcemaps")
const source = require("vinyl-source-stream")
const buffer = require("vinyl-buffer")

gulp.task("server", function(){
    server.run(["server.js"]);

    gulp.watch(["./src/**/*.html"], server.notify);
    gulp.watch(["./src/**/*.js"],["code-js"]);
});

gulp.task("code-js", function(){
    browserify({
        entries : "src/main.js",
        extensions : [".js"],
        debug : true
    })
    .transform( babelify,{
        presets : ["es2015", "stage-3"]
    })
    .bundle()
    .on("error", (err) => {
        console.log("ERRO ERRO ERROO");
        console.log(err.toString());
    })
    .pipe(source("app.js"))
    .pipe(buffer())
    .pipe(gulp.dest("public/js"));
});

gulp.task("default", ["server", "code-js"]);