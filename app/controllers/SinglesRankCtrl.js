app.controller("SinglesRankCtrl", 
  [  "$scope", 
  "fb", 
  "$location",
  "$firebaseArray",
  function($scope, fb, $location, $firebaseArray) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.displayedCollection = [];

    var users = $firebaseArray(ref.child('users'));
    users.$loaded().then(function(users){
      console.log("users", users);



      $scope.displayedCollection = _.sortBy(users,function(user){
        return -(user.winNum / user.lossNum);
      });
    });


    // ref.child('users').on('value', function(snapshot){
    //   var users = [];
    //   var people = snapshot.val();
    //   for(var user in people){

    //     people[user].winNum = Object.keys(people[user].wins).length;
    //     people[user].lossNum = Object.keys(people[user].losses).length;
    //     users[users.length] = people[user];
    //   }
    //   console.log("users", users);
    //   $scope.displayedCollection = users;
    // });

      // $scope.rowCollection = users;
      // $scope.displayedCollection = [].concat($scope.rowCollection);
    


  }
]);