app.controller("HomeCtrl", 
  ["$scope",
   "$firebaseArray",
   "fb",
  function($scope, $firebaseArray, fb) {
    // $scope.name = Auth.$getAuth().facebook.displayName;

    //This will connect to firebase and get the info
    var ref = new Firebase("https://pinterest-app.firebaseio.com/addpin");
    // download the data into a local object
    $scope.pins = $firebaseArray(ref);

}]);

//current user id, filter by the user id, only display filtered pins