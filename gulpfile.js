"use strict";
var gulp = require("gulp");
var mocha = require("gulp-mocha");
var gutil = require("gulp-util");
var nodemon = require("gulp-nodemon");
var stubby = require("gulp-stubby-server");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var eslint = require("gulp-eslint");
var istanbul = require("gulp-istanbul");
var lintspaces = require("gulp-lintspaces");
var watch = require("gulp-watch");

const fs = require("fs");

var models_path = __dirname + "/lib/models";
fs.readdirSync(models_path).forEach(function (file) {
  if (file.endsWith(".json")) {
    require(models_path + "/" + file);
  }
});

gulp.task("pre-mocha", ["tabpreventer"], function() {
  return gulp.src(["lib/**/*.js"])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task("tabpreventer", function() {
  return gulp.src(["app/**/*.js"])
    .pipe(lintspaces({
      indentation: "spaces",
      spaces: 2,
      ignores: [
        "js-comments",
        "c-comments"
      ]
    }))
    .pipe(lintspaces.reporter());
});

gulp.task("mocha", ["pre-mocha"], function() {
  return gulp.src(["test/**/*.js"])
    .pipe(mocha({
      "reporter": "mocha-jenkins-reporter",
      "reporterOptions":
        { "junit_report_path": "./reports/test-result.xml"
      }
    }))
    .pipe(istanbul.writeReports({reporters: ["cobertura"], reportOpts: { dir: "./reports" }}))
    .pipe(istanbul.enforceThresholds({thresholds: {global: 70}}))
    .on("error", gutil.log);
});

gulp.task("hint", function () {
  return gulp.src(["lib/**/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .on("error", function (error) {
       console.error(String(error));
  });
});

gulp.task("lint", function () {
  return gulp.src(["lib/**/*.js"]).pipe(eslint())
    .pipe(eslint.format("checkstyle", fs.createWriteStream("reports/checkstyle.xml")))
    .pipe(eslint.failOnError());
});

gulp.task("watch", function() {
  gulp.watch(["lib/**", "test/**"], ["mocha"]);
});

// TODO: configure for integration tests
gulp.task("mock-server", function(cb) {
    var options = {
        callback: function (server, options) {
          server.get(1, function (err, endpoint) {
            if (!err)
             console.log(endpoint);
          });
        },
        stubs: 8882,
        admin: 8889,
        mute: false,
        location: "localhost",
        files: [
            "test/mocks/*.{json,yaml,js}"
        ]
    };
    stubby(options, cb);
});

gulp.task("pre-push", ["lint", "hint", "mocha"]);

gulp.task("default", ["pre-push"]);
