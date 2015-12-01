(function() {
  'use strict';

  angular
    .module('MatchApp')
    .controller('DoublesRankCtrl', DoublesRankCtrl);

  DoublesRankCtrl.$inject = ["$log","$firebaseArray","league","tableUI","REF"];

  function DoublesRankCtrl($log, $firebaseArray, league, tableUI,fbref) { 
    var vm = this;

    var ref = new Firebase(fbref);

    // Promise gets the users current league
    // Only teams with matches in the current league context will be displayed
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
        // Remove teams without any league play
        teams = _.filter(teams, function(team){
          return (typeof team[league] !== "undefined");
        });
        $log.log('filtered teams', teams);
        // Teams need to be sorted by eloRating so that when the rank 
        // is assigned below in the for loop, the correct rank is assigned
        teams = _.sortBy(teams, function(team){
          if(team[league]){
            return team[league].eloRating;
          } else {
            return 1300;
          }
        });
        $log.log('sorted teams', teams);
        for(var i = 0; i < teams.length; i++){
          teams[i].rank = teams.length - i;
          teams[i].winNum = teams[i][league].winNum || 0;
          teams[i].lossNum = teams[i][league].lossNum || 0;
          teams[i].eloRating = teams[i][league].eloRating || 1300;
          teams[i].winPercent = (teams[i].winNum / (teams[i].winNum + teams[i].lossNum));
        }
        $log.log('edited teams', teams);
        vm.displayedCollection = teams;
      });
    }

    //Table Logic 
    vm.query = tableUI.query;
    vm.query.order = '-eloRating';
    vm.onpagechange = tableUI.onpagechange;
    vm.onorderchange = tableUI.onorderchange;
  }
})();
