var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  layout = require('gulp-layout'),
  frontMatter = require('gulp-front-matter'),
  // post css
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');
var config = require('./gulpconfig');

// Sass
gulp.task('sass', function() {
  var processors = [
    autoprefixer(config.postcss.autoprefixer)
  ];
  gulp.src([config.paths.sass + '**/**.scss'])
    .pipe(plumber())
    .pipe(sass(config.sass)
    .on('error', sass.logError))
    .pipe(postcss(processors))
      .pipe(gulp.dest(config.paths.public + config.paths.sass_output));
});
watch([config.paths.sass + '**/*.scss'], function() {
  gulp.start('sass');
});

// 其它不編譯的物件
var objs = [config.paths.source + '**/**.*'];
for (var i = 0; i < config.others.length; i++) {
  objs.push('!' + config.paths.source + config.others[i]);
}
gulp.task('others', function(){
  return gulp.src(objs)
    .pipe(plumber())
    .pipe(gulp.dest(config.paths.public));
});
watch(objs, function() {
  gulp.start('others');
});

// 樣板
gulp.task('gulp-layout', function() {
  return gulp.src([config.paths.source + '**/*.ejs', config.paths.source + '**/*.html'])
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(layout(function(file) {
      return file.frontMatter;
    }))
    .pipe(gulp.dest(config.paths.public));
});
watch([config.paths.source + '**/*.ejs', config.paths.source + '**/*.html'], function(){
  gulp.start('gulp-layout');
});

// webserver
gulp.task('webserver', function() {
  setTimeout(function(){
    gulp.src(config.paths.public)
      .pipe(webserver({
        livereload: true,
        open: false,
        host: '0.0.0.0',
        port: 10000,
      }));
  }, 1000);
});

gulp.task('default', ['gulp-layout', 'others', 'sass', 'webserver']);
