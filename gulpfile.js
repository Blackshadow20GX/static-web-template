var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var cleanCSS =  require("gulp-clean-css");
var browserSync  = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var htmlmin = require("gulp-htmlmin");
var del = require('del');
var rename = require('gulp-rename');
var nunjucks = require('gulp-nunjucks-render');
var sitemap = require('gulp-sitemap');
var minify = require('gulp-minify');
var s3 = require('gulp-s3-upload')({ useIAM: 'true' });
var awspublish = require('gulp-awspublish');

//User Settings
var config_live = require("./config-live.json");
var config_qa = require("./config-qa.json");
var config = config_qa; //Use QA config by default
var home_page = config.root; //Which page is at root
var page_url = config.url; //Base URL of the site
var s3_bucket = config.s3_bucket; //S3 bucket to upload to
var metadata = config.metadata; //File metadata

var styles_path = 'src/**/*.+(scss|sass|css)';
var pages_path = 'src/pages/**/*.html';
var special_path = 'src/special/*.html';
var partials_path = 'src/partials/';
var assets_path = 'src/assets/**/*';
var js_path = 'src/**/*.js';
var sitemap_path = 'dist/**/*.html';
var output_path = 'dist/**/*';

//Deletes the current dist folder so that it can be rebuilt
gulp.task('clean', function() {
	return del([
		'dist/**/*'
	])
});

//Builds The CSS file
gulp.task('styles', function() {
	return gulp.src(styles_path) //Compile from SASS
		.pipe(concat('style.min.css')) //Concatenate into one file
		.pipe(sass())
		.pipe(autoprefixer({  //Add prefixes for any browser with more than 1% market share
			browsers: ['> 1%'],
			cascade: false
		}))
		.pipe(cleanCSS({ compatibility: 'ie8' })) //minify
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload({ stream: true }))
});

//Compile and minify all js
gulp.task('js', function() {
    return gulp.src(js_path)
        .pipe(concat('main.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }))
});

//Moves HTML files into dist
gulp.task('pages', ['clean'], function() {
	return gulp.src(pages_path)
		.pipe(nunjucks({ path: partials_path }))
		.pipe(htmlmin({ collapseWhitespace: true, minifyJS: true })) //minify
		.pipe(rename(function (path) {
			if (path.basename !== home_page) { //main page goes at root
                path.dirname = path.dirname + '/' + path.basename;
			}
			path.basename = 'index';
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
});

//Generate the sitemap
gulp.task('sitemap', ['pages'], function() {
	return gulp.src(sitemap_path)
		.pipe(sitemap({
			siteUrl: page_url
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
});

//Move special pages (such as 404)
gulp.task('special', ['clean'], function() {
	return gulp.src(special_path)
		.pipe(nunjucks({ path: partials_path }))
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true })) //minify
		.pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }))
});

//Moves images, fonts, etc. to dist folder
gulp.task('assets', ['clean'], function() {
	return gulp.src(assets_path)
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('deploy-qa', ['build'], function() {
  gulp.start('publish');
});

gulp.task('deploy-live', ['build-live'], function() {
  gulp.start('publish');
});

//Runs the server
gulp.task('browserSync', function() {
	browserSync.init({ server: { baseDir: 'dist' } })
});

//Cleans, runs the scripts and serves from dist
gulp.task('serve', ['clean', 'browserSync', 'styles', 'assets', 'pages', 'js', 'sitemap', 'special'], function() {
	gulp.watch(styles_path, ['styles']);
	gulp.watch(pages_path, ['pages', 'sitemap']);
	gulp.watch(partials_path + '**/*.html', ['pages']);
  gulp.watch(special_path, ['special']);
	gulp.watch(assets_path, ['assets'])
});

//Set config to live variables
gulp.task('live-config', function() {
  config = config_live;
  home_page = config.root;
  page_url = config.url;
  s3_bucket = config.s3_bucket;
  metadata = config.metadata;
})

//Builds without serving
gulp.task('build', ['clean', 'styles', 'assets', 'pages', 'js', 'sitemap', 'special']);
gulp.task('build-live', ['live-config', 'build']);

//Publishes each file to S3, appending metadata to files matching
gulp.task('publish', function () {
	var publisher = awspublish.create({
		params:{
			Bucket: s3_bucket,
			ACL: 'public-read',
			Metadata: metadata
    }
  });

  gulp.src(output_path)
  .pipe(publisher.publish())
});
