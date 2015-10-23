app.controller("DoublesRankCtrl", 
  [  "$scope", 
  "fb", 
  "$location",
  "$firebaseArray",
  function($scope, fb, $location, $firebaseArray) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.displayedCollection = [];

    var teams = $firebaseArray(ref.child('doublesTeams'));
    teams.$loaded().then(function(teams){
      console.log("Teams", teams);

      $scope.displayedCollection = _.sortBy(teams,function(team){
        return -(team.winNum / team.lossNum);
      });
    });

  }
]);