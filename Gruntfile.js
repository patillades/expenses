module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      dev: {
        files: {
          'static/app.js': 'src/client/app.jsx',
        },
        options: {
          browserifyOptions: {
            paths: ['src/shared'],
          },
          transform: ['babelify'],
        },
      },
    },
    uglify: {
      default: {
        files: {
          'static/app.min.js': 'static/app.js',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['dev']);

  grunt.registerTask(
    'dev',
    [
      'browserify:dev',
    ]
  );
};
