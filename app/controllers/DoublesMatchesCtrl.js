app.controller("DoublesMatchesCtrl", 
  [  "$scope", 
  "fb", 
  "$location",
  "$firebaseArray",
  function($scope, fb, $location, $firebaseArray) {

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
        $scope.newMatch = {};   
        // updateRanks();
        updateTableData();
      });   
    };



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