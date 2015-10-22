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
        $scope.newMatch = {};   
      });   
    };

    function updateRanks(match){
      console.log("t1player1", match.t1player1);
      var team1uid = match.t1player1 + "-" + match.t1player2;
      var team2uid = match.t2player1 + "-" + match.t2player2;
      console.log("team2uid" + team2uid);

      ref.child('doublesTeams').child(team1uid).child('teamUid').set(team1uid);
      ref.child('doublesTeams').child(team2uid).child('teamUid').set(team2uid);

      if(match.t1score > match.t2score){
        ref.child('doublesTeams').child(team1uid).child('wins').push(team2uid);
        ref.child('doublesTeams').child(team2uid).child('losses').push(team1uid);
      } else {
        ref.child('doublesTeams').child(team1uid).child('losses').push(team2uid);
        ref.child('doublesTeams').child(team2uid).child('wins').push(team1uid);
      }
    }

    function checkForUser(uid){
      if(_.find(users, 'uid', uid)){
        return true;
      } else {
        return false;
      }
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