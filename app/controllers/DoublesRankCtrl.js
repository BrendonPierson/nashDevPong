app.controller("DoublesRankCtrl", 
  [  "$scope", 
  "$log",
  "$q",
  "$timeout",
  "$firebaseArray",
  "league",
  function($scope, $log, $q, $timeout, $firebaseArray, league) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.displayedCollection;

    // Promise gets the users current league
    var currentLeague = '';
    var promise = league.getLeague();
    promise.then(function(leag) {
      $log.log("league", leag);
      loadLeagueTeams(leag);
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    function loadLeagueTeams(league){
      var teams = $firebaseArray(ref.child('doublesTeams').orderByChild('league').equalTo(league));
      teams.$loaded().then(function(teams){
        $log.log('teams', teams);
        teams = _.sortByOrder(teams, ['eloRating'], ['desc']);

        for(var i = 0; i < teams.length; i++){
          teams[i].rank = i + 1;
          teams[i].winPercent = (teams[i].winNum / (teams[i].winNum + teams[i].lossNum));
        };
        $scope.displayedCollection = teams;
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