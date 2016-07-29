(function(){
  'user strict';
  angular
    .module("MatchApp")
    .factory("teamName", teamName);

    teamName.$inject = ["REF","$q"];

    function teamName(fbref,$q) {
      var ref = new Firebase(fbref);

      return function(match, league){
        return $q(function(resolve, reject) {
          var team1uid;
          var team2uid;
          var teamsArr = [];
          if (match.t1player1 < match.t1player2){
            team1uid = match.t1player1 + "-" + match.t1player2;
          } else {
            team1uid =  match.t1player2 + "-" + match.t1player1;
          }
          if (match.t2player1 < match.t2player2){
            team2uid = match.t2player1 + "-" + match.t2player2;
          } else {
            team2uid =  match.t2player2 + "-" + match.t2player1;
          }

          ref.child('doublesTeams').child(team1uid).child('teamUid').set(team1uid);
          ref.child('doublesTeams').child(team2uid).child('teamUid').set(team2uid);
          ref.child('doublesTeams').child(team1uid).child('league').set(league);
          ref.child('doublesTeams').child(team2uid).child('league').set(league);

          teamsArr[0] = team1uid;
          teamsArr[1] = team2uid;
          resolve(teamsArr);

        });
      };
    }

})();
