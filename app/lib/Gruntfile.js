module.exports = function(grunt) {

  grunt.initConfig({

    uglify: {
      my_target: {
        files: {
          '../dist/main.min.js': ['../app/**/*.js', 'bower_components/angular/angular.js', 'bower_components/angular-route/angular-route.js', 'bower_components/lodash/lodash.js', 'bower_components/angular-animate/angular-animate.js', 'bower_components/angular-aria/angular-aria.js', 'bower_components/firebase/firebase.js', 'bower_components/angularfire/dist/angularfire.js', 'bower_components/angularfire/dist/angularfire.js', 'bower_components/angular-material/angular-material.js', 'bower_components/angular-smart-table/dist/smart-table.js']
        }
      }
    },

    copy: {
      main: {
        src: ['../partials/*', '../index.html',],
        dest: '../dist/',
      },
    },

    jshint: {
      files: ['../app/**/*.js']
    },
    sass: {
      dist: {
        files: {
          '../app/styles/main.css': '../sass/main.scss'
        }
      }
    },
    watch: {
      app: {
        files: ['../app/**/*.js'],
        tasks: ['jshint']
      },
			sassy: {
        files: ['../sass/**/*.scss'],
        tasks: ['sass']
    }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint', 'sass', 'watch']);
  grunt.registerTask('build',['copy', 'sass', 'uglify']);
};