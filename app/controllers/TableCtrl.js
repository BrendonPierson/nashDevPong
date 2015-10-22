app.controller('TableCtrl', [
    '$scope','$firebaseArray', 
    function ($scope, $firebaseArray) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/singlesMatches");    

    $scope.rowCollection = $firebaseArray(ref);


    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.rowCollection.$loaded().then(function(){
        $scope.displayedCollection = [].concat($scope.rowCollection);
    });
   
    // //remove to the real data holder
    // $scope.removeItem = function removeItem(row) {
    //     var index = $scope.rowCollection.indexOf(row);
    //     if (index !== -1) {
    //         $scope.rowCollection.splice(index, 1);
    //     }
    // };



}]);