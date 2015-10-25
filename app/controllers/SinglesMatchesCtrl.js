app.controller("SinglesMatchesCtrl", 
  ["$scope", 
  "$log",
  "$q",
  "$timeout",
  "$firebaseArray",
  "league",
  "elo",
  "AddMatchStats",
  function($scope, $log, $q, $timeout, $firebaseArray, league, elo, addMatchStats) {
    // Initialize newMatch 
    $scope.newMatch = {};

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

    $scope.username = ref.getAuth().github.username;

    var user;
    ref.child("users/" + ref.getAuth().uid).on('value', function(snapshot){
      user = snapshot.val();
    });

    console.log("scope.user", $scope.user);

    $scope.users = $firebaseArray(ref.child('users'));

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

    $scope.addMatch = function(){
      $scope.newMatch.date = Date.now();
      $scope.newMatch.player1 = ref.getAuth().uid;
      $scope.newMatch.player1Rating = user.eloRating;
      $scope.newMatch.player2Rating = _.find($scope.users, 'uid', $scope.newMatch.player2).eloRating;
      $scope.newMatch.league = currentLeague;
      $scope.newMatch.winMargin = Math.abs($scope.newMatch.player1pts - $scope.newMatch.player2pts);
      $scope.displayedCollection.$add($scope.newMatch).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id); // returns location in the array
        // updateRanks($scope.newMatch);
        $scope.displayAddMatch = false;
        $scope.newMatch = {};   
      });   
    };

    // Toggle for add matches form
    $scope.displayAddMatch = false;
    $scope.toggleAddMatch = function(){
      $scope.displayAddMatch = $scope.displayAddMatch ? false : true;
    };

    function setTableData(league){
      $scope.displayedCollection = $firebaseArray(ref.child('singlesMatches').orderByChild('league').equalTo(league));
    }

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

}]);