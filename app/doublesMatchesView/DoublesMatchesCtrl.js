(function(){
  'use strict';
  angular
    .module('MatchApp')
    .controller('DoublesMatchesCtrl', DoublesMatchesCtrl);

    DoublesMatchesCtrl.$inject = ["$log","$firebaseArray","league","eloTeam",
      "AddMatchStats","teamName","tableUI","REF"];

    function DoublesMatchesCtrl ($log, $firebaseArray, league, 
      eloTeam, addMatchStats, teamName, tableUI, fbref) {
      var vm = this;
      
      var ref = new Firebase(fbref);

      vm.doubles = $firebaseArray(ref.child('doublesTeams'));
      vm.user = ref.getAuth().github;

      // Promise gets the users current league then displays only matches
      // that took place in that league context
      var currentLeague = '';
      var promise = league.getLeague();
      promise.then(function(leag) {
        setTableData(leag);
        vm.users = $firebaseArray(ref.child('users').orderByChild('league').equalTo(leag));
        currentLeague = leag;
      }, function(reason) {
        alert('Failed: ' + reason);
      });

      function setTableData(league){
        vm.displayedCollection = $firebaseArray(ref.child('doublesMatches').orderByChild('league').equalTo(league));
      }

      vm.addMatch = function(){
        vm.newMatch.date = Date.now();
        vm.newMatch.t1player1 = ref.getAuth().uid;
        updateRanks(vm.newMatch);
      };

      function updateRanks(match){
        // promise returns an array with team1uid and team2uid's
        var promise = teamName(match, currentLeague);
        promise.then(function(teamsArr) {
          var team1uid = teamsArr[0];
          var team2uid = teamsArr[1];

          match.league = currentLeague;
          match.winMargin = Math.abs(match.t1score - match.t2score);

          match.league = currentLeague;

          // Retrieve each teams ELO rating, if they exist, otherwise set to 1300
          if(typeof _.find(vm.doubles, 'teamUid', team1uid)[currentLeague] === "undefined"){
            match.team1Rating = 1300;
          } else {
            match.team1Rating = _.find(vm.doubles, 'teamUid', team1uid)[currentLeague].eloRating || 1300;
          }
          if(typeof _.find(vm.doubles, 'teamUid', team2uid)[currentLeague] === "undefined"){
            match.team2Rating = 1300;
          } else {
            match.team2Rating = _.find(vm.doubles, 'teamUid', team2uid)[currentLeague].eloRating || 1300;
          }

          // Update ELO, increment wins or losses, 
          // and push opposing team uid to win or loss array
          if(match.t1score > match.t2score){
            eloTeam(team1uid, team2uid);
            addMatchStats.pushResults('doublesTeams', team1uid, currentLeague, team2uid);
            addMatchStats.incrementCounts('doublesTeams', match, team1uid, team2uid, currentLeague, false);
          } else {
            eloTeam(team2uid, team1uid);
            addMatchStats.pushResults('doublesTeams', team2uid, currentLeague, team1uid);
            addMatchStats.incrementCounts('doublesTeams', match, team2uid, team1uid, currentLeague, false);
          }
          // Add the match to firebase
          vm.displayedCollection.$add(match).then(function(ref) {
            vm.displayAddMatch = false;
            vm.newMatch = {};   
          });  

        }, function(reason) {
          // Teams array promise failed
          $log.log('Failed: ' + reason);
        });
      }

      // Initially hide the add match form
      // Toggle add match form on button click
      vm.displayAddMatch = false;
      vm.toggleAddMatch = function(){
        vm.displayAddMatch = vm.displayAddMatch ? false : true;
      };

      //Table Logic 
      vm.query = tableUI.query;
      vm.onpagechange = tableUI.onpagechange;
      vm.onorderchange = tableUI.onorderchange;
    }
})();