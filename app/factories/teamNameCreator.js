app.factory("teamName", [
  "$q",
  function($q) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")

    return function(match){
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
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

        teamsArr[0] = team1uid;
        teamsArr[1] = team2uid;

        resolve(teamsArr);

      });
    }
  }
]);

