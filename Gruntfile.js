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
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['dev']);

  grunt.registerTask(
    'dev',
    [
      'browserify:dev',
    ]
  );
};
