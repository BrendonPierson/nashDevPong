(function(){
  'use strict';
  angular
    .module('MatchApp')
    .controller("SinglesMatchesCtrl", SinglesMatchesCtrl);

  SinglesMatchesCtrl.$inject = ["$log","$location","$firebaseArray","league",
    "elo","AddMatchStats","tableUI","REF"];

  function SinglesMatchesCtrl($log, $location, $firebaseArray,
    league, elo, addMatchStats, tableUI,fbref) {

    var vm = this,
        ref = new Firebase(fbref),
        user,
        currentLeague = '';

    // Initialize newMatch
    vm.newMatch = {};


    // Get the github username from the auth obj
    vm.username = ref.getAuth().github.username;

    // Find the current user obj based on auth obj uid
    ref.child("users/" + ref.getAuth().uid).on('value', function(snapshot){
      user = snapshot.val();
    });

    // Used for when user clicks on a name in the table,
    // takes the user to a detailed view of whomever they clicked on
    vm.userStatsPage = function(user){
      $location.path("/stats/" + user);
    };


    // Promise gets the users current league
    // Only users with matches in the current league are displayed
    var promise = league.getLeague();
    promise.then(function(leag) {
      $log.log("league", leag);
      setTableData(leag);
      vm.users = $firebaseArray(ref.child('users').orderByChild('league').equalTo(leag));
      currentLeague = leag;
    }, function(reason) {
      alert('Failed: ' + reason);
    });

    // Add a new singles match
    vm.addMatch = function(){
      console.log("vm.newMatch", vm.newMatch)
      vm.newMatch.date = Date.now();
      vm.newMatch.player1 = ref.getAuth().uid;
      if(user[currentLeague]){
        vm.newMatch.player1Rating = user[currentLeague].eloRating || 1300;
      } else {
        vm.newMatch.player1Rating = 1300;
      }
      if(_.find(vm.users, 'uid', vm.newMatch.player2)[currentLeague]){
        vm.newMatch.player2Rating = _.find(vm.users, 'uid', vm.newMatch.player2)[currentLeague].eloRating || 1300;
      } else {
        vm.newMatch.player2Rating = 1300;
      }
      vm.newMatch.league = currentLeague;
      vm.newMatch.winMargin = Math.abs(vm.newMatch.player1pts - vm.newMatch.player2pts);
      debugger;
      vm.displayedCollection.$add(vm.newMatch).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id); // returns location in the array
        updateRanks(vm.newMatch);
        vm.displayAddMatch = false;
        vm.newMatch = {};
      });
    };

    // Toggle for add matches form
    vm.displayAddMatch = false;
    vm.toggleAddMatch = function(){
      vm.displayAddMatch = vm.displayAddMatch ? false : true;
    };
    // Populate table data
    function setTableData(league){
      vm.displayedCollection = $firebaseArray(ref.child('singlesMatches').orderByChild('league').equalTo(league));
    }
    // Update users ELO, win/loss counter and push opposing team to appropriate array
    function updateRanks(match){
      if(match.player1pts > match.player2pts){
        elo(match.player1, match.player2);
        addMatchStats.pushResults('users', match.player1, currentLeague, match.player2);
        addMatchStats.incrementCounts('users', match, "player1", "player2", currentLeague, true);
      } else {
        elo(match.player2, match.player1);
        addMatchStats.pushResults('users', match.player2, currentLeague, match.player1);
        addMatchStats.incrementCounts('users', match, "player2", "player1", currentLeague, true);
      }
    }

    //Table Logic
    vm.query = tableUI.query;
    vm.onpagechange = tableUI.onpagechange;
    vm.onorderchange = tableUI.onorderchange;

  }


})();
