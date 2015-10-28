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
    
    $scope.onpagechange = function(page, limit) {
      var deferred = $q.defer();
      
      $timeout(function () {
        deferred.resolve();
      }, 2000);
      
      return deferred.promise;
    };
    
    $scope.onorderchange = function(order) {
      var deferred = $q.defer();
      
      $timeout(function () {
        deferred.resolve();
      }, 2000);
      
      return deferred.promise;
    };

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
    
    ref.child("users/" + $routeParams.id).on('value', function(snapshot){
      $scope.user = snapshot.val();
      $log.log("user", $scope.user);
    });

    $scope.showChangeLeague = false;
    $scope.toggleChangeLeague = function(){
      $scope.showChangeLeague = $scope.showChangeLeague ? false : true;
    };

    $scope.showNewLeague = false;
    $scope.toggleNewLeague = function(){
      $scope.showNewLeague = $scope.showNewLeague ? false : true;
    };

    $scope.leagues = $firebaseArray(ref.child('leagues'));

}]);
