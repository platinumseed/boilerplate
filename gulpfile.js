// ===========================================================================
// Paths =====================================================================
// ===========================================================================

/*** Assets Directories ***/
var assetsdir_sass = 'assets/sass/**/*.scss';

var assetsdir_alljs = 'assets/js/**/*.js';
var assetsdir_authorjs = 'assets/js/*.js';
var assetsdir_js = 'assets/js';
var assetsorder_js = [
  assetsdir_js + '/app.js' 
];

var assetsdir_images = 'assets/img/**/*';

/*** Distribution Directories ***/
var distdir_css = 'css';

var distdir_js = 'js';
var distname_js = 'app.min.js';

var distdir_images = 'img';

// ===========================================================================
// Initialization ============================================================
// ===========================================================================

/*** Gulp init ***/
var gulp = require('gulp');

/*** Auto plugin loading init ***/
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

/*** Timestamp Variable ***/
var runTimestamp = Math.round(Date.now()/1000);

// ===========================================================================
// SASS ======================================================================
// ===========================================================================

/*** SASS Compilation, Minification and Sourcemaps writing ***/
gulp.task('sass', function() {
    return gulp.src(assetsdir_sass)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.plumber({
          errorHandler: function (err) {
              console.log(err);
              this.emit('end');
          }
      }))
      .pipe(plugins.sass())
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cssnano({
          zindex: false,
          normalizeUrl: {
            stripWWW: false
          }
        }))
      .pipe(plugins.rename(function (path) {
        path.extname = ".min.css"
      }))
      .pipe(plugins.sourcemaps.write('/maps'))
      .pipe(gulp.dest(distdir_css))
      .pipe(plugins.livereload());
});

// ===========================================================================
// Javascript ================================================================
// ===========================================================================

/*** Javascript Linting ***/
gulp.task('lintjs', function() {
    return gulp.src(assetsdir_authorjs)
      .pipe(plugins.plumber({
          errorHandler: function (err) {
              console.log(err);
              this.emit('end');
          }
      }))
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'));
});

/*** Javascript Concatenation, Minification and Sourcemaps writing ***/
gulp.task('buildjs', function() {
  return gulp.src(assetsorder_js)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(plugins.concat(distname_js))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('/maps'))
    .pipe(gulp.dest(distdir_js))
    .pipe(plugins.livereload());
});

// ===========================================================================
// Images ====================================================================
// ===========================================================================

/*** Image optimization ***/
gulp.task('imagemin', function() {
    return gulp.src([assetsdir_images])
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(plugins.changed(distdir_images))
        .pipe(plugins.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(distdir_images))
        .pipe(plugins.livereload());
});

// ===========================================================================
// Watch Task ================================================================
// ===========================================================================

gulp.task('watch', function() {
    plugins.livereload.listen();
    gulp.watch(assetsdir_sass, ['sass']);
    gulp.watch(assetsdir_alljs, ['buildjs']);
    gulp.watch(assetsdir_images, ['imagemin']);
});

// ===========================================================================
// Build =====================================================================
// ===========================================================================

gulp.task('build', function(callback) {
    plugins.sequence('sass')(callback)
});
