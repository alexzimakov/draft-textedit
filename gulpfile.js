const gulp = require('gulp');
const webpack = require('webpack-stream');
const runSequence = require('run-sequence');
const minimist = require('minimist');
const del = require('del');
const pump = require('pump');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const knownOptions = {
  string: ['env', 'component'],
  default: {
    env: process.env.NODE_ENV || 'production',
  },
};
const options = minimist(process.argv.slice(2), knownOptions);
const paths = {
  lib: 'lib',
  dist: 'dist',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
  ],
  srcStyle: 'src/**/*.css',
};

gulp.task('clean', () => {
  del.sync([paths.lib, paths.dist]);
});

gulp.task('lib', done => {
  pump([gulp.src(paths.src), babel(), gulp.dest(paths.lib)], done);
});

gulp.task('dist', done => {
  pump(
    [
      gulp.src(`lib/${options.component}.js`),
      webpack({
        output: {
          filename: `${options.component}.js`,
          libraryTarget: 'umd',
          library: options.component,
        },
        externals: {
          react: {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
          },
          'react-dom': {
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
          },
          'prop-types': {
            root: 'PropTypes',
            commonjs: 'prop-types',
            commonjs2: 'prop-types',
            amd: 'prop-types',
          },
          immutable: {
            root: 'Immutable',
            commonjs: 'immutable',
            commonjs2: 'immutable',
            amd: 'immutable',
          },
          'draft-js': {
            root: 'Draft',
            commonjs: 'draft-js',
            commonjs2: 'draft-js',
            amd: 'draft-js',
          },
        },
      }),
      gulp.dest('dist/'),
    ],
    done
  );
});

gulp.task('style', () =>
  gulp
    .src(paths.srcStyle)
    .pipe(concat(`${options.component}.css`))
    .pipe(autoprefixer({ flexbox: 'no-2009' }))
    .pipe(gulp.dest(paths.dist))
);

gulp.task('compress:js', done => {
  pump(
    [
      gulp.src('lib/*.js'),
      uglify(),
      rename({ suffix: '.min', extname: '.js' }),
      gulp.dest(paths.dist),
    ],
    done
  );
});

gulp.task('compress:css', done => {
  pump(
    [
      gulp.src(`dist/${options.component}.css`),
      cleanCSS(),
      rename({ suffix: '.min', extname: '.css' }),
      gulp.dest(paths.dist),
    ],
    done
  );
});

gulp.task('build', done => {
  const tasks = ['clean', 'lib', ['dist', 'style']];

  if (options.env === 'production') {
    tasks.push(['compress:js', 'compress:css']);
  }

  runSequence(...tasks, done);
});

gulp.task('style:watch', () => {
  gulp.watch(paths.srcStyle, ['style']);
});

gulp.task('dist:watch', () => {
  gulp.watch(paths.src, ['lib', 'dist']);
});

gulp.task('dev', ['build', 'dist:watch', 'style:watch']);

gulp.task('default', ['build']);
