const use   = require("rekuire"),

      gulp  = require("gulp"),
      debug = require("gulp-debug"),

      Paths = use("paths");

// add paths
Paths.addPath("dist",        Paths.getPath("root") + "/dist");
Paths.addPath("src",         Paths.getPath("root") + "/src");
Paths.addPath("tests",       Paths.getPath("root") + "/tests");
Paths.addPath("source-file", Paths.getPath("root") + "/src/it.js");

// load tasks
use("/tasks/build");
use("/tasks/test");
use("/tasks/watch");
use("/tasks/bump");
use("/tasks/doc");
use("/tasks/ci");

// the default task is left here for quick testing purposes
gulp.task("default", function() {
    var src = Paths.getPath("src");

    return gulp
        .src([
            src + "/**/.*", // include . (dot) files and folders
            src + "/**/*"
        ])
        .pipe(debug());
});
