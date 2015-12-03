(function() {
    'use strict';

    angular
      .module('MatchApp')
      .controller('SinglesRankCtrl', SinglesRankCtrl);

    SinglesRankCtrl.$inject = ["$log","$q","$timeout","$location",
      "$firebaseArray", "league", "tableUI","REF"];
                              
    function SinglesRankCtrl($log, $q, $timeout, $location, $firebaseArray, 
      league, tableUI,fbref) { 

      var vm = this,
          ref = new Firebase(fbref),
          currentLeague = '';

      vm.displayedCollection = [];

      // Promise gets the users current league
      var promise = league.getLeague();
      promise.then(function(leag) {
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
          // Need to sort for adding rank number
          users = _.sortBy(users, function(user){
            if(user[league]){
              return user[league].eloRating;
            } else {
              return 1300;
            }
          });

          // Remove users with no games
          users = _.filter(users, function(user){
            return (typeof user[league] !== "undefined");
          });
          for (var i = users.length - 1; i >= 0; i--) {
            users[i].winNum = users[i][league].winNum || 0;
            users[i].lossNum = users[i][league].lossNum || 0;
            users[i].eloRating = users[i][league].eloRating || 1300;
            users[i].rank = users.length - i;
            users[i].winPercent = users[i].winNum / (users[i].winNum + users[i].lossNum);
          }
          vm.displayedCollection = users;
        });
      }

      vm.userStatsPage = function(user){
        $location.path("/stats/" + user);
      };

      //Table Logic 
      vm.query = tableUI.query;
      vm.query.order = '-eloRating';

      vm.onpagechange = tableUI.onpagechange;
      vm.onorderchange = tableUI.onorderchange;
    }
})();
