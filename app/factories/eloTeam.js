app.factory("eloTeam", [
  "$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")
    var doublesTeams = $firebaseArray(ref.child('doublesTeams'));

    return function(winnerUid, loserUid){
      doublesTeams.$loaded().then(function(){
        var winner = _.find(doublesTeams, 'uid', winnerUid);
        var loser = _.find(doublesTeams, 'uid', loserUid);
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

