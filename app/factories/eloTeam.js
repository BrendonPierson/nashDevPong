app.factory("eloTeam", [
  "$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")
    var doublesTeams = $firebaseArray(ref.child('doublesTeams'));

    return function(winnerUid, loserUid){
      doublesTeams.$loaded().then(function(){
        var winner = _.find(doublesTeams, 'teamUid', winnerUid);
        var loser = _.find(doublesTeams, 'teamUid', loserUid);
        console.log("typeof", typeof loser.eloRating);
        if(typeof loser.eloRating === 'undefined'){
          loser.eloRating = 1300;
        }
        if(typeof winner.eloRating === 'undefined'){
          winner.eloRating = 1300;
        }
        console.log("winner", winner);

        var rankDiff = loser.eloRating - winner.eloRating;

        var winnerExpected = 1 / (1 + Math.pow(10, (rankDiff) / 400));
        var loserExpected = 1 - winnerExpected;

        var winnerNewRank = winner.eloRating + 32 * (1 - winnerExpected);
        var loserNewRank = loser.eloRating - 32 * (loserExpected); 

        ref.child('doublesTeams/' + winnerUid).child('eloRating').set(winnerNewRank);
        ref.child('doublesTeams/' + loserUid).child('eloRating').set(loserNewRank);
      });
    }
  }
]);

