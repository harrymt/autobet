

// FTP and version control paths
var releasePath = "release/autobet";
var cssBuild = "css/build"; //
var jsBuild = "js/build";
var maincss = cssBuild + '/main.css';
var mainjs = jsBuild + '/main.js';
var copyCSS = 'cp ' + maincss + ' ' + releasePath + '/' + maincss;
var copyJS = 'cp ' + mainjs + ' ' + releasePath + '/' + mainjs;
var copyIndex = 'cp index.php ' + releasePath + '/index.php';
var copyRetrieve = 'cp retrieve.php ' + releasePath + '/retrieve.php';
var copyScrape = 'cp scrapeTools.php ' + releasePath + '/scrapeTools.php';
var copyPhpSetup = 'cp phpsetup.php ' + releasePath + '/phpsetup.php';
var scpRelease = 'scp -r ' + releasePath + ' uploader@178.62.121.34:/var/www/html';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Get the package which lists all the tasks
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      multiple: {
        command: [
          // Make a new release, overwrite release folder
          copyCSS, copyJS, copyRetrieve, copyScrape, copyPhpSetup, copyIndex, scpRelease // upload
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
        options: { style: 'compressed' },
        files: {
          "css/build/main.css": 'css/main.scss' // dest <- source
        }
      }
    },
    watch: {
      all: {
        files: ['js/*.js', 'css/*.scss', '*.php'],
        tasks: ['uglify', 'sass', 'shell']
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-sass');  // Sass
  grunt.loadNpmTasks('grunt-shell');// Ftp to server
  grunt.loadNpmTasks('grunt-contrib-watch');  // Reload files on change

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'sass', 'shell']);
};
