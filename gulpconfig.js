module.exports = {
  /*
   * 排除需要編譯的檔案，其餘移至 public
   */
  others: [
    '**/*.html',
    '**/*.ejs',
    '**/*.scss',
    '**/*.sass',
    '**/*.css'
  ],

  /*
   * 檔案輸出、輸入路徑
   */
  paths: {
    // 來源
    'source': './source/',
    'sass': './source/stylesheets/',
    'img': './source/images/',
    // 輸出
    'sass_output': 'stylesheets/',
    'public': './public/',
  },

  /*
   * CSS, PostCSS, Sass 設定
   * 目前 PostCSS 僅有加入 autoprefixer
   */
  postcss: {
    'autoprefixer': {browsers: ['last 5 version']}
  },
  sass: {
    'output_style': 'compressed', // sass 輸出模式，可選 'nested', 'expanded', 'compact', 'compressed'
    // 'includePaths': ['./bower_components/bootstrap/scss/']
  }
}
