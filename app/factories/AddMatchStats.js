app.factory("AddMatchStats", [
  "$log",
  function($log) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")

    function transactCallback(currentData){
      if (currentData === null) {
        $log.log('user had no wins.');
        return 1;
      } else {
        $log.log('Added one win.');
        return currentData += 1; // Abort the transaction.
      }
    }

    return {
      pushResults: function(child, winId, currentLeague, lossId){
        // This pushes the oposing team's uid to the wins or losses array 
        // and the current Leagues wins or losses array
        ref.child(child).child(winId).child(currentLeague).child("wins").push(lossId);
        ref.child(child).child(winId).child("wins").push(lossId);
        ref.child(child).child(lossId).child(currentLeague).child("losses").push(winId);
        ref.child(child).child(lossId).child("losses").push(winId);
      },
      incrementCounts: function(child, match, winner, loser, league, convertIds){
        // increment the wins or losses for user and current league
        var winnerId = winner;
        var loserId = loser;
        if(convertIds){
          winnerId = match[winner];
          loserId = match[loser];
        }
        ref.child(child).child(winnerId).child('winNum').transaction(transactCallback);
        ref.child(child).child(winnerId).child(league).child('winNum').transaction(transactCallback);
        ref.child(child).child(loserId).child('lossNum').transaction(transactCallback);
        ref.child(child).child(loserId).child(league).child('lossNum').transaction(transactCallback);
      }
    };
  }
]);

