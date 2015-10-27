app.controller("SinglesRankCtrl", 
  [  "$scope", 
  "$log",
  "$q",
  "$timeout",
  "$firebaseArray",
  "league",
  function($scope, $log, $q, $timeout, $firebaseArray, league) {

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


    $scope.query = {
      order: '-eloRating',
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

  }
]);