app.controller("UserStatsCtrl", 
  ["$scope",
  "$log",
  "$routeParams",
  "$firebaseArray",
  function($scope, $log, $routeParams, $firebaseArray) {
    // $scope.userId = $routeParams.id;

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");
    
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

    $scope.changeUserLeague = function(){
      ref.child('users/' + $routeParams.id + '/league').set($scope.user.league);
      $scope.showChangeLeague = false;
    };

    $scope.newleague = {};
    $scope.addNewLeague = function(){
      $scope.newleague.createdBy = ref.getAuth().uid;
      $scope.newleague.dateCreated = Date.now();
      $log.log("newleague", $scope.newleague);
      // Creating a var of the push allows the capture of the key 
      var pushRef = ref.child('leagues').push($scope.newleague);
      ref.child('leagues/' + pushRef.key() ).child('uid').set(pushRef.key());
      ref.child('users/' + $routeParams.id + '/league').set(pushRef.key());
      $scope.showNewLeague = false;
      $scope.newleague = {};
    };



}]);
