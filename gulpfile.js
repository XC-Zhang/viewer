const gulp = require("gulp");

gulp.task("webpack", function (done) {
    const webpack = require("webpack");
    const options = require("./webpack.config");
    webpack(options).run(function (err, stats) {
        if (err) {
            done(err);
        } else {
            console.log(stats.toString());
            done();
        }
    });
});