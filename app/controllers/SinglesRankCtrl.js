app.controller("SinglesRankCtrl", 
  [  "$scope", 
  "$log",
  "$q",
  "$timeout",
  "$firebaseArray",
  "league",
  "tableUI",
  function($scope, $log, $q, $timeout, $firebaseArray, league, tableUI) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.displayedCollection = [];


    // Promise gets the users current league
    var currentLeague = '';
    var promise = league.getLeague();
    promise.then(function(leag) {
      $log.log("league", leag);
      loadLeagueUsers(leag);
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    function loadLeagueUsers(league){
      var users = $firebaseArray(ref.child('users').orderByChild('league').equalTo(league));
      users.$loaded().then(function(users){
        // console.log("users", users);
        // Need to sort for adding rank number
        users = _.sortByOrder(users, ['eloRating'], ['desc']);
        // Remove users with no games
        users = _.filter(users, function(user){
          return (user.winNum > 0 || user.lossNum > 0)
        });
        for (var i = users.length - 1; i >= 0; i--) {
          users[i].winPercent = users[i].winNum / (users[i].winNum + users[i].lossNum);
          users[i].rank = i + 1;
        };
        $scope.displayedCollection = users;
      });
    }

    //Table Logic 
    $scope.query = tableUI.query;
    $scope.onpagechange = tableUI.onpagechange;
    $scope.onorderchange = tableUI.onorderchange;

  }
]);