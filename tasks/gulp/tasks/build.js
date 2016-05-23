const use     = require("rekuire"),

      gulp     = require("gulp"),
      remove   = require("del"),
      rename   = require("gulp-rename"),
      compress = require("gulp-uglify"),
      header   = require("gulp-header"),
      sequence = require("gulp-sequence"),
      debug    = require("gulp-debug"),

      Paths   = use("paths");

gulp.task("build::clear", function(cb) {
    var dist = Paths.getPath("dist");

    remove(
        [
            dist + "/**/.*", // include . (dot) files and folders
            dist + "/**/*"
        ],
        {
            force : true
        }
    )
    .then(
        // success
        function() {
            cb();
        },
        // error
        function() {
            console.log(arguments);
            cb();
        }
    );
});

// copy the source into /dist
gulp.task("build::copy-source", function() {
    return gulp
        .src(Paths.getPath("source-file"))
        .pipe(gulp.dest(Paths.getPath("dist")));
});

// build the minified version of source into .dist
gulp.task("build::build-source", function() {
    var pkg = use("package.json");

    return gulp
        .src(Paths.getPath("source-file"))
        .pipe(rename({
            suffix : ".min"
        }))
        .pipe(compress())
        .pipe(header(
            "/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= pkg.license %> @ <%= pkg.author %> */\n",
            {
                pkg : pkg
            }
        ))
        .pipe(gulp.dest(Paths.getPath("dist")))
});

gulp.task(
    "build::build",
    function(cb) {
        sequence(
            "build::copy-source",
            "build::build-source"
        )(cb);
    }
);

gulp.task(
    "build",
    function(cb) {
        sequence(
            "build::clear",
            "build::build"
        )(cb);
    }
);

Paths.appendToPath("watch", Paths.getPath("src") + "/**/*.js");
