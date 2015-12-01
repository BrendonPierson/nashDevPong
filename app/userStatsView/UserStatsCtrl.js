(function() {
  'use strict';

  angular
    .module('MatchApp')
    .controller('UserStatsCtrl', UserStatsCtrl);

  UserStatsCtrl.$inject = ["$log","$q","$timeout","$routeParams","$firebaseArray"]

    function UserStatsCtrl($log, $q, $timeout, $routeParams, $firebaseArray) { 
      var vm = this;

      var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

      // Table Logic
      vm.query = {
        order: '-date',
        limit: 5,
        page: 1
      };
      
      // Promise responsible for tablepage-change animation
      vm.onpagechange = function(page, limit) {
        var deferred = $q.defer();
        $timeout(function () {
          deferred.resolve();
        }, 2000);
        return deferred.promise;
      };
      // Promise responsible for table orderchange animation
      vm.onorderchange = function(order) {
        var deferred = $q.defer();
        
        $timeout(function () {
          deferred.resolve();
        }, 2000);
        
        return deferred.promise;
      };

      // Get an array of all singles matches
      // filter through the array to find only matches the user was part of 
      // using lodash functions
      var allSinglesMatches = $firebaseArray(ref.child('singlesMatches'));
      vm.displayedCollection = [];
      allSinglesMatches.$loaded().then(function(){
        for (var i = allSinglesMatches.length - 1; i >= 0; i--) {
          if(_.chain(allSinglesMatches[i]).values().contains($routeParams.id).value()){
            vm.displayedCollection[vm.displayedCollection.length] = allSinglesMatches[i];
          }
        }
        console.log("singlesMatches", vm.displayedCollection);
      });

      // Get an array of all doubles matches
      // filter through the array to find only matches the user was part of 
      // using lodash functions
      vm.displayed2Collection = [];
      var allDoublesMatches = $firebaseArray(ref.child('doublesMatches'));
      vm.displayedCollection = [];
      allDoublesMatches.$loaded().then(function(){
        for (var i = allDoublesMatches.length - 1; i >= 0; i--) {
          if(_.chain(allDoublesMatches[i]).values().contains($routeParams.id).value()){
            vm.displayed2Collection[vm.displayed2Collection.length] = allDoublesMatches[i];
          }
        }
        console.log("doublesMatches", vm.displayed2Collection);
      });
      
      // Get the user firebase obj
      ref.child("users/" + $routeParams.id).on('value', function(snapshot){
        vm.user = snapshot.val();
        $log.log("user", vm.user);
      });

    }
})();

