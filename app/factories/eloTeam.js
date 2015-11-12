app.factory("eloTeam", [
  "$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")
    var doublesTeams = $firebaseArray(ref.child('doublesTeams'));

    function updateLeagueElo(winner, loser, league){
      if(typeof loser[league].eloRating === 'undefined'){
        loser[league].eloRating = 1300;
      }
      if(typeof winner[league].eloRating === 'undefined'){
        winner[league].eloRating = 1300;
      }

      console.log("current team league", league);
      console.log("loserRating", loser[league].eloRating);
      console.log("winnerRating", winner[league].eloRating);


      var rankDiff = loser[league].eloRating - winner[league].eloRating;
      var winnerExpected = 1 / (1 + Math.pow(10, (rankDiff) / 400));
      var loserExpected = 1 - winnerExpected;

      var winnerNewRank = winner[league].eloRating + 32 * (1 - winnerExpected);
      var loserNewRank = loser[league].eloRating - 32 * (loserExpected);
      console.log('winnerNewRank', winnerNewRank);
      console.log('loserNewRank', loserNewRank);

      ref.child('doublesTeams/' + winner.teamUid).child(league).child('eloRating').set(winnerNewRank);
      ref.child('doublesTeams/' + loser.teamUid).child(league).child('eloRating').set(loserNewRank);
    }

    return function(winnerUid, loserUid){
      doublesTeams.$loaded().then(function(){
        var winner = _.find(doublesTeams, 'teamUid', winnerUid);
        var loser = _.find(doublesTeams, 'teamUid', loserUid);
        var league = winner.league;
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

        updateLeagueElo(winner, loser, league);

        ref.child('doublesTeams/' + winnerUid).child('eloRating').set(winnerNewRank);
        ref.child('doublesTeams/' + loserUid).child('eloRating').set(loserNewRank);
      });
    }
  }
]);

