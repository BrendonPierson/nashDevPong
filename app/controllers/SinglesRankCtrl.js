app.controller("SinglesRankCtrl", 
  [  "$scope", 
  "$log",
  "$firebaseArray",
  "league",
  function($scope, $log, $firebaseArray, league) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.displayedCollection = [];


    // Promise gets the users current league
    var currentLeague = '';
    var promise = league.getLeague();
    promise.then(function(leag) {
      $log.log("league", leag);
      loadLeagueUsers(leag);
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    function loadLeagueUsers(league){
      var users = $firebaseArray(ref.child('users').orderByChild('league').equalTo(league));
      users.$loaded().then(function(users){
        console.log("users", users);
        $scope.displayedCollection = _.sortBy(users,function(user){
          return -(user.winNum / user.lossNum);
        });
      });
    }
  }
]);