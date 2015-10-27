app.controller("DoublesMatchesCtrl", 
  ["$scope", 
  "$log",
  "$q",
  "$timeout",
  "$firebaseArray",
  "league",
  "eloTeam",
  "AddMatchStats",
  "teamName",
  function($scope, $log, $q, $timeout, $firebaseArray, league, 
    eloTeam, addMatchStats, teamName) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

    $scope.doubles = $firebaseArray(ref.child('doublesTeams'));

    $scope.title="Doubles Matches";

    $scope.users = $firebaseArray(ref.child('users'));

    $scope.user = ref.getAuth().github;

    console.log("scope.user", $scope.user);

    // Promise gets the users current league
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

        match.team1Rating = _.find($scope.doubles, 'teamUid', team1uid).eloRating;
        match.team2Rating = _.find($scope.doubles, 'teamUid', team2uid).eloRating;

        if(typeof match.team1Rating === "undefined"){
          match.team1Rating = 1300;
        }
        if(typeof match.team2Rating === "undefined"){
          match.team2Rating = 1300;
        }

        if(match.t1score > match.t2score){
          eloTeam(team1uid, team2uid);
          addMatchStats.pushResults('doublesTeams', team1uid, currentLeague, team2uid);
          addMatchStats.incrementCounts('doublesTeams', match, team1uid, team2uid, currentLeague, false);
        } else {
          eloTeam(team2uid, team1uid);
          addMatchStats.pushResults('doublesTeams', team2uid, currentLeague, team1uid);
          addMatchStats.incrementCounts('doublesTeams', match, team2uid, team1uid, currentLeague, false);
        }
        console.log("match", match);
        $scope.displayedCollection.$add(match).then(function(ref) {
          var id = ref.key();
          console.log("added record with id " + id); // returns location in the array
          $scope.displayAddMatch = false;
          $scope.newMatch = {};   
        });  

      }, function(reason) {
        alert('Failed: ' + reason);
      });
    }

    $scope.displayAddMatch = false;
    $scope.toggleAddMatch = function(){
      $scope.displayAddMatch = $scope.displayAddMatch ? false : true;
    };

    //Table Logic 
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


}]);