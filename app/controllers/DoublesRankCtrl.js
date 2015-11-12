app.controller("DoublesRankCtrl", 
  [  "$scope", 
  "$log",
  "$firebaseArray",
  "league",
  "tableUI",
  function($scope, $log, $firebaseArray, league, tableUI) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    // Promise gets the users current league
    // Only teams with matches in the current league context will be displayed
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
        // $log.log('teams', teams);
        // Teams need to be sorted by eloRating so that when the rank 
        // is assigned below in the for loop, the correct rank is assigned
        teams = _.sortByOrder(teams, ['eloRating'], ['desc']);

        for(var i = 0; i < teams.length; i++){
          teams[i].rank = i + 1;
          teams[i].winNum = teams[i][league].winNum;
          teams[i].lossNum = teams[i][league].lossNum;
          //teams[i].eloRating = teams[i][league].eloRating;
          teams[i].winPercent = (teams[i][league].winNum / (teams[i][league].winNum + teams[i][league].lossNum));
        }
        $scope.displayedCollection = teams;
      });
    }

    //Table Logic 
    $scope.query = tableUI.query;
    $scope.onpagechange = tableUI.onpagechange;
    $scope.onorderchange = tableUI.onorderchange;

  }
]);