app.filter('leagueFilter', [
  "$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase('https://nashdev-pong.firebaseio.com/');
    var leagues = $firebaseArray(ref.child('leagues'));

    return function(uid) {
      leagues.$loaded().then(function(){
        console.log("leagueNickname", _.find(leagues, 'uid', uid).nickName);
        return _.find(leagues, 'uid', uid).nickName;
      });
    };
  }
]);