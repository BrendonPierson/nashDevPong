app.filter('leagueFilter', [
  "fb",
  function(fb) {
    var leagues = fb.getLeagueArr();

    return function(uid) {
      return _.find(leagues, 'uid', uid).nickName;
    };
  }
]);