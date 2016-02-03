var config = {}

/*
 * CSS, PostCSS, Sass 設定
 */
 config.css = {
  'postcss': {
    'output_name': 'all.css',
    'output_folder': 'css'
  }
}

/*
 * 檔案輸出、輸入路徑
 */
config.paths = {
  'source': './source/',
  'sass': './source/stylesheets/',
  'sass_output': 'stylesheets/',
  'img': './source/images/',
  'public': './public/',
}

/*
 * 免編譯物件 (圖片...etc)
 */
config.others = [
  '**/*.jpg',
  '**/*.png',
  '**/*.js'
]

/* ======= 以下是編譯排程 ====== */
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

// Sass
gulp.task('sass', function() {
  gulp.src([config.paths.sass + '**/**.scss'])
    .pipe(plumber())
    .pipe(sass({outputStyle: 'nested'})
    .on('error', sass.logError))
      .pipe(gulp.dest(config.paths.public + config.paths.sass_output))
});
watch([config.paths.sass + '**/*.scss'], function() {
  gulp.start('sass');
});

// postCSS
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 1 version']})
  ];
  watch(config.paths.public + config.paths.sass_output + '**/**.css', function(){
    gulp.src(config.paths.public + config.paths.sass_output + '**/**.css')
      .pipe(plumber())
      .pipe(concat(config.css.postcss.output_name))
      .pipe(postcss(processors))
      .pipe(gulp.dest(config.paths.public + config.css.postcss.output_folder));
  });
});

// 其它不編譯的物件
var objs = [];
for (var i = 0; i < config.others.length; i++) {
  objs.push(config.paths.source + config.others[i]);
}
gulp.task('others', function(){
  return gulp.src(objs)
    .pipe(plumber())
    .pipe(gulp.dest(config.paths.public))
});
watch(objs, function() {
  gulp.start('others');
});

// 樣板
gulp.task('gulp-layout', function() {
  return gulp.src(config.paths.source + '**/*.html')
    .pipe(frontMatter())
    .pipe(layout(function(file) {
      return file.frontMatter;
    }))
    .pipe(gulp.dest(config.paths.public));
});
watch(config.paths.source + '**/**.html', function(){
  gulp.start('gulp-layout');
});

// webserver
gulp.task('webserver', function() {
  gulp.src(config.paths.public)
    .pipe(webserver({
      livereload: true,
      open: false,
      host: '0.0.0.0',
      port: 10000,
    }));
});

gulp.task('default', ['gulp-layout', 'others', 'sass', 'css', 'webserver']);
