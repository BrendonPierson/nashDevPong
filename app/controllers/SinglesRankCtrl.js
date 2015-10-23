app.controller("SinglesRankCtrl", 
  [  "$scope", 
  "fb", 
  "$location",
  "$firebaseArray",
  function($scope, fb, $location, $firebaseArray) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.displayedCollection = [];

    var users = $firebaseArray(ref.child('users'));
    users.$loaded().then(function(users){
      console.log("users", users);
      $scope.displayedCollection = _.sortBy(users,function(user){
        return -(user.winNum / user.lossNum);
      });
    });
  }
]);