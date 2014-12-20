

// FTP and version control paths
var releasePath = "release/autobet";
var cssBuild = "css/build";
var jsBuild = "js/build";
var maincss = cssBuild + '/main.css';
var mainjs = jsBuild + '/main.js';
var copyCSS = 'cp ' + maincss + ' ' + releasePath + '/' + maincss;
var copyJS = 'cp ' + mainjs + ' ' + releasePath + '/' + mainjs;

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Get the package which lists all the tasks
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      multiple: {
        command: [
          // Make a new release, overwrite release folder
          copyCSS, copyJS,
          'cp index.html ' + releasePath + '/index.html',
          'scp -r ' + releasePath + ' uploader@178.62.121.34:/var/www/html' // upload
        ].join('&&')
      }
    },
    uglify: {
      build: {
        src: ['js/libs/*.js', 'js/*.js'], // input
        dest: mainjs // output
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          maincss: 'css/main.scss' // dest <- source
        }
      }
    },
    watch: {
      all: {
        files: ['js/*.js', 'css/*.scss'],
        tasks: ['uglify', 'sass', 'shell']
      },
    },
  });

  grunt.loadNpmTasks('grunt-shell');// Ftp to server
  grunt.loadNpmTasks('grunt-contrib-uglify');  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-sass');  // Sass
  grunt.loadNpmTasks('grunt-contrib-watch');  // Reload files on change

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'sass', 'shell']);
};
