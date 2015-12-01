module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    karma: {
        unit: {
            configFile: 'karma.conf.js'
        }
    },

    jshint: {
      files: [
        '../doublesMatchesView/*.js', 
        '../doublesRankView/*.js', 
        '../factories/*.js',
        '../filters/*.js',
        '../homeVIew/*.js',
        '../navView/*.js',
        '../singlesMatchesView/*.js',
        '../singlesRankView/*.js',
        '../userStatsView/*.js',
        '../app*.js'
      ]
    },
    sass: {
      dist: {
        files: {
          '../styles/main.css': '../sass/main.scss'
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

  grunt.registerTask('default', ['jshint', 'sass', 'karma', 'watch']);
};