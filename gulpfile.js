const gulp = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const gutil = require('gulp-util');

gulp.task('webpack', (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if(err) throw new gutil.PluginError('webpack', err);

    gutil.log('[webpack]', stats.toString({
      chunks: false,
      colors: true,
    }));

    callback();
  });
});

gulp.task('default', ['webpack']);
