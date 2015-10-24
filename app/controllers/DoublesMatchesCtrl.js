app.controller("DoublesMatchesCtrl", 
  [  "$scope", 
  "fb", 
  "$location",
  "$firebaseArray",
  function($scope, fb, $location, $firebaseArray) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

    $scope.title="Doubles Matches";

    $scope.users = fb.getUsersArr();

    $scope.user = fb.getAuthObj().$getAuth().github;

    console.log("scope.user", $scope.user);



    $scope.rowCollection = $firebaseArray(fb.getRef().child('doublesMatches'));


    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.rowCollection.$loaded().then(function(){
        $scope.displayedCollection = [].concat($scope.rowCollection);
    });


    $scope.addMatch = function(){
      $scope.newMatch.date = Date.now();
      $scope.newMatch.t1player1 = fb.getAuthObj().$getAuth().uid;

      $scope.rowCollection.$add($scope.newMatch).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id); // returns location in the array
        updateRanks($scope.newMatch);
        updateTableData();
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
        addWin(match,team1uid);
        addLoss(match,team2uid);
        ref.child('doublesTeams').child(team1uid).child('wins').push(team2uid);
        ref.child('doublesTeams').child(team2uid).child('losses').push(team1uid);
      } else {
        addWin(match,team2uid);
        addLoss(match,team1uid);
        ref.child('doublesTeams').child(team1uid).child('losses').push(team2uid);
        ref.child('doublesTeams').child(team2uid).child('wins').push(team1uid);
      }
    }

    function addWin(match, team){
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
    }

    function addLoss(match, team){
      // Update wins num
      ref.child('users').child(match[team]).child('lossNum').transaction(function(currentData) {
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

    function updateTableData(){
      console.log("updating table data");
      $scope.rowCollection = $firebaseArray(fb.getRef().child('doublesMatches'));


      //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
      $scope.rowCollection.$loaded().then(function(){
          $scope.displayedCollection = [].concat($scope.rowCollection);
      });
    }

}]);