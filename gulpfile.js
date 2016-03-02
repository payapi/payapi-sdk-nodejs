var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var stubby = require('gulp-stubby-server');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var eslint = require('gulp-eslint');

const fs = require('fs');

var models_path = __dirname + '/lib/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (file.endsWith('.json')) {
    require(models_path + '/' + file)
  }
})

gulp.task('mocha', function() {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha({ reporter: 'nyan' }))
    .on('error', gutil.log);
});

gulp.task('hint', function () {
  return gulp.src(['lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .on('error', function (error) {
       console.error(String(error));
  });
});

gulp.task('lint', function () {
  return gulp.src(['lib/**/*.js']).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch', function() {
  gulp.watch(['lib/**', 'test/**'], ['mocha','hint','lint']);
});

// TODO: configure for integration tests
gulp.task('mock-server', function(cb) {
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
        location: 'localhost',
        files: [
            'test/mocks/*.{json,yaml,js}'
        ]
    };
    stubby(options, cb);
});
