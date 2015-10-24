app.controller("DoublesRankCtrl", 
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
      loadLeagueTeams(leag);
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    function loadLeagueTeams(league){
      var teams = $firebaseArray(ref.child('doublesTeams').orderByChild('league').equalTo(league));
      teams.$loaded().then(function(teams){
        $log.log("teams", teams);
        $scope.displayedCollection = _.sortBy(teams,function(team){
          return -(team.winNum / team.lossNum);
        });
      });
    }



  }
]);