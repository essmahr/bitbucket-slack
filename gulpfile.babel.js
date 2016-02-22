// much of this is from https://github.com/aeldar/es6-express-scaffold-app

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import cp from 'child_process';
import browserSync from 'browser-sync';
import compression from 'compression'; // for gzip compression for browserSync server

const devDir = '.tmp';
const srcDir = 'src';
const buildDir = 'build';

const src = {};

/**
 * This is the list of npm modules for production, that should be bundle into vendor.js instead of index.js
 */
const dependencies = [];

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// compile server side scripts for dev mode
gulp.task('scripts:server:dev', function () {
  return gulp.src(`${srcDir}/**/*.js`)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${devDir}`));
});

//compile server side scripts for production
gulp.task('scripts:server:build', function () {
  return gulp.src(`${srcDir}/**/*.js`)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${buildDir}/${srcDir}`));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint:server', lint(`${srcDir}/**/*.js`));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));


// prepare everything except js from server side for dev mode
gulp.task('extras:server:dev', () => {
  return gulp.src([
    `${srcDir}/**/*.*`,
    `!${srcDir}/**/*.js`
  ], {
    dot: true
  }).pipe(gulp.dest(`${devDir}`));
});

// build all except js from server side for production
gulp.task('extras:server:build', () => {
  return gulp.src([
    `${srcDir}/**/*.*`,
    `!${srcDir}/**/*.js`
  ], {
    dot: true
  }).pipe(gulp.dest(`${buildDir}/${srcDir}`));
});

// Launch a Node.js/Express server
gulp.task('express:dev', ['scripts:server:dev', 'extras:server:dev'], (cb) => {
  src.server = [
    'bin/www',
    `${devDir}/**/*`
  ];

  let started = false;

  var server = (function startup() {
    const newEnv = process.env;

    newEnv.NODE_ENV = 'development'; // Add DEVELOPER mode
    var child = cp.fork('bin/www', {
      env: newEnv
    });
    child.once('message', function(message) {
      if (message.match(/^online$/)) {
        if (browserSync) {
          browserSync.reload();
        }
        if (!started) {
          started = true;
          gulp.watch(src.server, function() {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', function() {
    server.kill('SIGTERM');
  });
});

// Launch BrowserSync development server
gulp.task('serve', ['express:dev'], function(cb) {

  browserSync({
    logPrefix: 'Sync',
    notify: false,
    // Run as an https by setting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: false,
    // Informs browser-sync to proxy our Express app which would run
    // at the following location. PORT MUST MATCH ENV
    proxy: {
      target: 'localhost:5000',
      middleware: compression()
    }
  }, cb);

  process.on('exit', function() {
    browserSync.exit();
  });

  gulp.watch(`${srcDir}/**/*.js`, ['scripts:server:dev']);
  gulp.watch([
    `${srcDir}/**/*`,
    `!${srcDir}/**/*.js`
  ], ['extras:server:dev']);
});

gulp.task('serve:test', () => {
  // gulp.watch('test/spec/**/*.js').on('change', reload);
  // gulp.watch('test/spec/**/*.js', ['lint:test']);
});

gulp.task('clean', del.bind(null, [`${devDir}`, `${buildDir}`]));

gulp.task('build', ['lint', 'lint:server', 'scripts:server:build', 'extras:server:build'], () => {
  // return gulp.src(`${buildDir}/${clientDir}/**/*`).pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
