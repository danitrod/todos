const WEB_DIR = 'web';
const SERVER_DIR = 'server';

module.exports = function (grunt) {
  grunt.initConfig({
    run: {
      buildWeb: { exec: `yarn --cwd ${WEB_DIR} build` },
      buildServer: { exec: `yarn --cwd ${SERVER_DIR} build` },
    },
    clean: [`./${WEB_DIR}/build`, `./${SERVER_DIR}/public`, `./${SERVER_DIR}/dist`],
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: `./${WEB_DIR}/build`,
            src: '**',
            dest: `./${SERVER_DIR}/public/`,
          },
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean', 'run:buildWeb', 'run:buildServer', 'copy']);
};
