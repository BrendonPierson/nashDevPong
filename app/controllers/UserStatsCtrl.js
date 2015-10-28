app.controller("UserStatsCtrl", 
  ["$scope",
  "$log",
  "$q",
  "$timeout",
  "$routeParams",
  "$firebaseArray",
  function($scope, $log, $q, $timeout, $routeParams, $firebaseArray) {
    // $scope.userId = $routeParams.id;
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    // Table Logic
    $scope.query = {
      order: '-date',
      limit: 5,
      page: 1
    };
    
    // Promise responsible for tablepage-change animation
    $scope.onpagechange = function(page, limit) {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve();
      }, 2000);
      return deferred.promise;
    };
    // Promise responsible for table orderchange animation
    $scope.onorderchange = function(order) {
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
    $scope.displayedCollection = [];
    allSinglesMatches.$loaded().then(function(){
      for (var i = allSinglesMatches.length - 1; i >= 0; i--) {
        if(_.chain(allSinglesMatches[i]).values().contains($routeParams.id).value()){
          $scope.displayedCollection[$scope.displayedCollection.length] = allSinglesMatches[i];
        }
      };
      console.log("singlesMatches", $scope.displayedCollection);
    });

    // Get an array of all doubles matches
    // filter through the array to find only matches the user was part of 
    // using lodash functions
    $scope.displayed2Collection = [];
    var allDoublesMatches = $firebaseArray(ref.child('doublesMatches'));
    $scope.displayedCollection = [];
    allDoublesMatches.$loaded().then(function(){
      for (var i = allDoublesMatches.length - 1; i >= 0; i--) {
        if(_.chain(allDoublesMatches[i]).values().contains($routeParams.id).value()){
          $scope.displayed2Collection[$scope.displayed2Collection.length] = allDoublesMatches[i];
        }
      };
      console.log("doublesMatches", $scope.displayed2Collection);
    });
    
    // Get the user firebase obj
    ref.child("users/" + $routeParams.id).on('value', function(snapshot){
      $scope.user = snapshot.val();
      $log.log("user", $scope.user);
    });

}]);
