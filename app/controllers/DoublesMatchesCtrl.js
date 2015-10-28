app.controller("DoublesMatchesCtrl", 
  ["$scope", 
  "$log",
  "$firebaseArray",
  "league",
  "eloTeam",
  "AddMatchStats",
  "teamName",
  "tableUI",
  function($scope, $log, $firebaseArray, league, 
    eloTeam, addMatchStats, teamName, tableUI) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

    $scope.doubles = $firebaseArray(ref.child('doublesTeams'));
    $scope.users = $firebaseArray(ref.child('users'));
    $scope.user = ref.getAuth().github;

    $log.log("scope.user", $scope.user);

    // Promise gets the users current league then displays only matches
    // that took place in that league context
    var currentLeague = '';
    var promise = league.getLeague();
    promise.then(function(leag) {
      $log.log("league", leag);
      setTableData(leag);
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    function setTableData(league){
      $scope.displayedCollection = $firebaseArray(ref.child('doublesMatches').orderByChild('league').equalTo(league));
    }

    $scope.addMatch = function(){
      $scope.newMatch.date = Date.now();
      $scope.newMatch.t1player1 = ref.getAuth().uid;
      updateRanks($scope.newMatch);
    };

    function updateRanks(match){
      // promise returns an array with team1uid and team2uid's
      var promise = teamName(match, currentLeague);
      promise.then(function(teamsArr) {
        var team1uid = teamsArr[0];
        var team2uid = teamsArr[1];

        match.league = currentLeague;
        match.winMargin = Math.abs(match.t1score - match.t2score);

        // Retrieve each teams ELO rating
        match.team1Rating = _.find($scope.doubles, 'teamUid', team1uid).eloRating;
        match.team2Rating = _.find($scope.doubles, 'teamUid', team2uid).eloRating;

        // Handle case of a new team without a rating
        if(typeof match.team1Rating === "undefined"){
          match.team1Rating = 1300;
        }
        if(typeof match.team2Rating === "undefined"){
          match.team2Rating = 1300;
        }

        // Update ELO, increment wins or losses, 
        // and push opposing team uid to win or loss array
        if(match.t1score > match.t2score){
          eloTeam(team1uid, team2uid);
          addMatchStats.pushResults('doublesTeams', team1uid, currentLeague, team2uid);
          addMatchStats.incrementCounts('doublesTeams', match, team1uid, team2uid, currentLeague, false);
        } else {
          eloTeam(team2uid, team1uid);
          addMatchStats.pushResults('doublesTeams', team2uid, currentLeague, team1uid);
          addMatchStats.incrementCounts('doublesTeams', match, team2uid, team1uid, currentLeague, false);
        }
        // Add the match to firebase
        $scope.displayedCollection.$add(match).then(function(ref) {
          $scope.displayAddMatch = false;
          $scope.newMatch = {};   
        });  

      }, function(reason) {
        // Teams array promise failed
        $log.log('Failed: ' + reason);
      });
    }

    // Initially hide the add match form
    // Toggle add match form on button click
    $scope.displayAddMatch = false;
    $scope.toggleAddMatch = function(){
      $scope.displayAddMatch = $scope.displayAddMatch ? false : true;
    };

    //Table Logic 
    $scope.query = tableUI.query;
    $scope.onpagechange = tableUI.onpagechange;
    $scope.onorderchange = tableUI.onorderchange;

}]);