import gulp from 'gulp'
import watch from 'gulp-watch'
import plumber from 'gulp-plumber'
import svgmin from 'gulp-svgmin'
import svgsprite from 'gulp-svg-sprite'

gulp.task('svg', () => {
  gulp.src('src/svg/*.svg')
    .pipe(svgmin({ plugins: [
      { convertStyleToAttrs: true },
      { removeTitle: true },
      { removeStyleElement: true },
      { removeAttrs: { attrs: 'id|class' } },
      { removeDimensions: true },
      { removeUselessDefs: true }
    ] }))
    .pipe(svgsprite({
      mode: {
        symbol: {
          dest: './',
          sprite: 'icons.svg'
        }
      }
    }))
    .pipe(gulp.dest('build/assets'))
})

gulp.task('html', () => {
  gulp.src('src/html/*.html').pipe(gulp.dest('build'))
})

gulp.task('html:watch', () => {
  watch('src/html/**/*', () => gulp.start('html'))
})

gulp.task('css', () => {
  gulp.src('src/css/*.css').pipe(gulp.dest('build/css'))
})

gulp.task('css:watch', () => {
  watch('src/css/**/*', () => gulp.start('css'))
})

gulp.task('build', ['html', 'css'])
gulp.task('watch', ['html:watch', 'css:watch'])
gulp.task('dev', ['build', 'watch'])
