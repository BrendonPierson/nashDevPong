app.controller("SinglesMatchesCtrl", 
  [  "$scope", 
  "fb", 
  "$location",
  "$firebaseArray",
  function($scope, fb, $location, $firebaseArray) {
    $scope.newMatch = {};

    var ref = new Firebase("https://nashdev-pong.firebaseio.com");

    $scope.title="Singles Matches";

    $scope.users = $firebaseArray(ref.child('users'));

    $scope.user = fb.getAuthObj().$getAuth().github;




    $scope.rowCollection = $firebaseArray(ref.child('singlesMatches'));
    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.rowCollection.$loaded().then(function(){
        $scope.displayedCollection = [].concat($scope.rowCollection);
    });

    $scope.addMatch = function(){
      $scope.newMatch.date = Date.now();
      $scope.newMatch.player1 = fb.getAuthObj().$getAuth().uid;
      $scope.rowCollection.$add($scope.newMatch).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id); // returns location in the array
        updateRanks($scope.newMatch);
        updateTableData();
        $scope.displayAddMatch = false;
        $scope.newMatch = {};   
      });   
    };

    // Toggle logit for add matches form
    $scope.displayAddMatch = false;
    $scope.toggleAddMatch = function(){
      $scope.displayAddMatch = $scope.displayAddMatch ? false : true;
    };

    function updateRanks(match){

      if(match.player1pts > match.player2pts){


        addWin(match, "player1");
        addLoss(match, "player2");

        ref.child('users').child(match.player1).child('wins').push(match.player2);
        ref.child('users').child(match.player2).child('losses').push(match.player1);
      } else {

        addWin(match, "player2");
        addLoss(match, "player1");

        ref.child('users').child(match.player1).child('losses').push(match.player2);
        ref.child('users').child(match.player2).child('wins').push(match.player1);
      }

    }

    function updateTableData(){
      console.log("updating table data");
      $scope.rowCollection = $firebaseArray(fb.getRef().child('singlesMatches'));


      //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
      $scope.rowCollection.$loaded().then(function(){
          $scope.displayedCollection = [].concat($scope.rowCollection);
      });
    }



      


    function addWin(match, player){
      // Update wins num
      ref.child('users').child(match[player]).child('winNum').transaction(function(currentData) {
        if (currentData === null) {
          console.log('user had now wins.');
          return 1;
        } else {
          console.log('Added one win.');
          return currentData += 1; // Abort the transaction.
        }
      });
    }

    function addLoss(match, player){
      // Update wins num
      ref.child('users').child(match[player]).child('lossNum').transaction(function(currentData) {
        if (currentData === null) {
          console.log('user had now wins.');
          return 1;
        } else {
          console.log('Added one win.');
          return currentData += 1; // Abort the transaction.
        }
      });
    }











}]);