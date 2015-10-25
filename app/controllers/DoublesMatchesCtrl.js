app.controller("DoublesMatchesCtrl", 
  ["$scope", 
  "$log",
  "$q",
  "$timeout",
  "$firebaseArray",
  "league",
  function($scope, $log, $q, $timeout, $firebaseArray, league) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

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
      $scope.newMatch.league = currentLeague;

      $scope.rowCollection.$add($scope.newMatch).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id); // returns location in the array
        updateRanks($scope.newMatch);
        $scope.displayAddMatch = false;
        $scope.newMatch = {};   
      });   
    };

    function updateRanks(match){
      console.log("t1player1", match.t1player1);
      var team1uid;
      var team2uid;

      // Logic to prevent doubles of the same pair
      if (match.t1player1 < match.t1player2){
        team1uid = match.t1player1 + "-" + match.t1player2;
      } else {
        team1uid =  match.t1player2 + "-" + match.t1player1;
      }

      if (match.t1player1 < match.t1player2){
        team2uid = match.t2player1 + "-" + match.t2player2;
      } else {
        team2uid =  match.t2player2 + "-" + match.t2player1;
      }

      console.log("team2uid" + team2uid);

      ref.child('doublesTeams').child(team1uid).child('teamUid').set(team1uid);
      ref.child('doublesTeams').child(team2uid).child('teamUid').set(team2uid);


      if(match.t1score > match.t2score){
        addWin(match,team1uid, currentLeague);
        addLoss(match,team2uid, currentLeague);
        ref.child('doublesTeams').child(team1uid + "-winNum").push(team2uid);
        ref.child('doublesTeams').child(team2uid + "-lossNum").push(team1uid);
      } else {
        addWin(match,team2uid, currentLeague);
        addLoss(match,team1uid, currentLeague);
        ref.child('doublesTeams').child(team1uid + "-lossNum").push(team2uid);
        ref.child('doublesTeams').child(team2uid + "-winNum").push(team1uid);
      }
    }

    function addWin(match, team, league){
      // Update wins num
      ref.child('users').child(match[team]).child('winNum').transaction(function(currentData) {
        if (currentData === null) {
          console.log('user had now wins.');
          return 1;
        } else {
          console.log('Added one win.');
          return currentData += 1; // Abort the transaction.
        }
      });
      ref.child('users').child(match[team]).child(league).child('winNum').transaction(function(currentData) {
        if (currentData === null) {
          console.log('user had now wins.');
          return 1;
        } else {
          console.log('Added one win.');
          return currentData += 1; // Abort the transaction.
        }
      });
    }

    function addLoss(match, team, league){
      // Update wins num
      ref.child('users').child(match[team]).child(league).child('lossNum').transaction(function(currentData) {
        if (currentData === null) {
          console.log('user had now wins.');
          return 1;
        } else {
          console.log('Added one win.');
          return currentData += 1; // Abort the transaction.
        }
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