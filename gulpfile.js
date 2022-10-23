const { src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

// Define the default task
exports.default = function() {

    // Read in all *.scss files from the src directory
    return src(['src/*.scss', 'src/**/*.scss'])

        // Compile SCSS into CSS and minify the output
        .pipe(sass({ outputStyle: 'compressed' }))

        // Rename the output file(s) with ".min.css"
        .pipe(rename({ extname: '.min.css' }))

        // Write the output file(s) to the output directory
        .pipe(dest('output/'));
}