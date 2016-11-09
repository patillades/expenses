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
    cssmin: {
      options: {
        report: 'min',
        keepSpecialComments: 0,
      },
      default: {
        files: {
          'static/style.min.css': 'node_modules/react-datepicker/dist/react-datepicker.css',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['dev']);

  grunt.registerTask(
    'dev',
    [
      'browserify:dev',
    ]
  );
};
