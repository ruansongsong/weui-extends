var gulp = require('gulp');
var less = require('gulp-less');
var  sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var reload  = browserSync.reload;
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = 
"/**\n\
* weui extends v" + pkg.version + "\n\
* author ruansongsong\n\
*/\n";
gulp.task('less', function () {
	gulp.src('src/weui-extend.less')
	.pipe(sourcemaps.init())
	.pipe(less())
	.pipe(postcss([autoprefixer(['ios >= 7', 'android >= 4.1'])]))
	.pipe(header(banner))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/style'))
	.pipe(browserSync.reload({stream: true}));
});
// 发布到webapp的项目目录中
gulp.task('lessed', function () {
	gulp.src('src/test/weui-extend.less')
	.pipe(sourcemaps.init())
	.pipe(less())
	.pipe(postcss([autoprefixer(['ios >= 7', 'android >= 4.1'])]))
	.pipe(header(banner))
	.pipe(cssnano({
            zindex: false,
            autoprefixer: false
        }))
	.pipe(rename(function (path) {
		path.basename += '.min';
	}))

	.pipe(gulp.dest('../workspace/trunk/src/main/webapp/static/css/'))
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['less']);
    gulp.watch("dist/example/*.html").on('change', reload);
});
gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		startPath: '/example'
	});
});
gulp.task('test', function () {
	gulp.start('server');
	gulp.start('watch');
});