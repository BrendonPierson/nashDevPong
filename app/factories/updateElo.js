app.factory("elo", [
  "$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")
    var users = $firebaseArray(ref.child('users'));
    var uid = ref.getAuth().uid;
    var league = '';

    return function(winnerUid, loserUid){
      users.$loaded().then(function(){
        var winner = _.find(users, 'uid', winnerUid);
        var loser = _.find(users, 'uid', loserUid);
        var rankDiff = loser.eloRating - winner.eloRating;

        var winnerExpected = 1 / (1 + Math.pow(10, (rankDiff) / 400));
        var loserExpected = 1 - winnerExpected;

        var winnerNewRank = winner.eloRating + 32 * (1 - winnerExpected);
        var loserNewRank = loser.eloRating - 32 * (loserExpected); 

        ref.child('users/' + winnerUid).child('eloRating').set(winnerNewRank);
        ref.child('users/' + loserUid).child('eloRating').set(loserNewRank);
      });
    }

    
  }
]);

