module.exports = (grunt) => {
  grunt.initConfig({
    browserify: {
      default: {
        files: {
          'static/app.js': 'src/client/app.jsx',
        },
        options: {
          browserifyOptions: {
            paths: ['src/client'],
          },
          transform: ['babelify'],
        },
      },
      // test: {
      //   files: {
      //     'src/client/tests/dest/expenses.reducer.test.browserify.js':
      //       'src/client/tests/src/expenses.reducer.test.js',
      //   },
      //   options: {
      //     browserifyOptions: {
      //       paths: ['src/client'],
      //     },
      //     transform: ['babelify'],
      //   },
      // },
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
          'static/style.min.css': [
            'node_modules/react-datepicker/dist/react-datepicker.css',
            'node_modules/rc-time-picker/assets/index.css',
          ],
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask(
    'default',
    [
      'browserify',
      // 'uglify',
      // 'cssmin',
    ]
  );
};
