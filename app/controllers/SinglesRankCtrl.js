app.controller("SinglesRankCtrl", 
  [  "$scope", 
  "$log",
  "$q",
  "$timeout",
  "$location",
  "$firebaseArray",
  "league",
  "tableUI",
  function($scope, $log, $q, $timeout, $location, $firebaseArray, league, tableUI) {

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

    // Callback function that fires once the league is returned
    // Orders users by elo and asigns rank
    function loadLeagueUsers(league){
      var users = $firebaseArray(ref.child('users').orderByChild('league').equalTo(league));
      users.$loaded().then(function(users){
        // console.log("users", users);
        // Need to sort for adding rank number
        users = _.sortBy(users, function(user){
          if(user[league]){
            return parseInt(user[league].eloRating);
          } else {
            return 1300;
          }
        });

        // Remove users with no games
        users = _.filter(users, function(user){
          return (user.winNum > 0 || user.lossNum > 0);
        });
        for (var i = users.length - 1; i >= 0; i--) {
          users[i].winNum = users[i][league].winNum || 0;
          users[i].lossNum = users[i][league].lossNum || 0;
          users[i].eloRating = users[i][league].eloRating || 1300;
          users[i].rank = users.length - i;
          users[i].winPercent = users[i].winNum / (users[i].winNum + users[i].lossNum);
        }
        $scope.displayedCollection = users;
      });
    }

    $scope.userStatsPage = function(user){
      $location.path("/stats/" + user);
    };

    //Table Logic 
    // $scope.query = tableUI.query;
    $scope.query = {
      order: '-eloRating',
      limit: 5,
      page: 1
    };
    $scope.onpagechange = tableUI.onpagechange;
    $scope.onorderchange = tableUI.onorderchange;

  }
]);