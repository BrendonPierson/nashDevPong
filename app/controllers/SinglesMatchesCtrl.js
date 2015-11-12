app.controller("SinglesMatchesCtrl", 
  ["$scope", 
  "$log",
  "$location",
  "$firebaseArray",
  "league",
  "elo",
  "AddMatchStats",
  "tableUI",
  function($scope, $log, $location, $firebaseArray, 
    league, elo, addMatchStats, tableUI) {
    // Initialize newMatch 
    $scope.newMatch = {};

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

    // Get the github username from the auth obj
    $scope.username = ref.getAuth().github.username;

    // Find the current user obj based on auth obj uid
    var user;
    ref.child("users/" + ref.getAuth().uid).on('value', function(snapshot){
      user = snapshot.val();
    });

    // Used for when user clicks on a name in the table, 
    // takes the user to a detailed view of whomever they clicked on
    $scope.userStatsPage = function(user){
      $location.path("/stats/" + user);
    };


    // Promise gets the users current league
    // Only users with matches in the current league are displayed
    var currentLeague = '';
    var promise = league.getLeague();
    promise.then(function(leag) {
      $log.log("league", leag);
      setTableData(leag);
      $scope.users = $firebaseArray(ref.child('users').orderByChild('league').equalTo(leag));
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    // Add a new singles match
    $scope.addMatch = function(){
      $scope.newMatch.date = Date.now();
      $scope.newMatch.player1 = ref.getAuth().uid;
      if(user[currentLeague]){
        $scope.newMatch.player1Rating = user[currentLeague].eloRating || 1300;
      } else {
        $scope.newMatch.player1Rating = 1300;
      }
      if(_.find($scope.users, 'uid', $scope.newMatch.player2)[currentLeague]){
        $scope.newMatch.player2Rating = _.find($scope.users, 'uid', $scope.newMatch.player2)[currentLeague].eloRating || 1300;
      } else {
        $scope.newMatch.player2Rating = 1300;
      }
      $scope.newMatch.league = currentLeague;
      $scope.newMatch.winMargin = Math.abs($scope.newMatch.player1pts - $scope.newMatch.player2pts);
      $scope.displayedCollection.$add($scope.newMatch).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id); // returns location in the array
        updateRanks($scope.newMatch);
        $scope.displayAddMatch = false;
        $scope.newMatch = {};   
      });   
    };

    // Toggle for add matches form
    $scope.displayAddMatch = false;
    $scope.toggleAddMatch = function(){
      $scope.displayAddMatch = $scope.displayAddMatch ? false : true;
    };
    // Populate table data
    function setTableData(league){
      // var singlesMatches = $firebaseArray(ref.child('singlesMatches').orderByChild('league').equalTo(league));
      // singlesMatches.$loaded().then(function(){
      //   for (var i = 0; i < singlesMatches.length; i++) {
      //     singlesMatches[i].
      //   };
      // });
      $scope.displayedCollection = $firebaseArray(ref.child('singlesMatches').orderByChild('league').equalTo(league));
    }
    // Update users ELO, win/loss counter and push opposing team to appropriate array
    function updateRanks(match){
      if(match.player1pts > match.player2pts){
        elo(match.player1, match.player2);
        addMatchStats.pushResults('users', match.player1, currentLeague, match.player2);
        addMatchStats.incrementCounts('users', match, "player1", "player2", currentLeague, true);
      } else {
        elo(match.player2, match.player1);
        addMatchStats.pushResults('users', match.player2, currentLeague, match.player1);
        addMatchStats.incrementCounts('users', match, "player2", "player1", currentLeague, true);
      }
    }
    
    //Table Logic 
    $scope.query = tableUI.query;
    $scope.onpagechange = tableUI.onpagechange;
    $scope.onorderchange = tableUI.onorderchange;

}]);