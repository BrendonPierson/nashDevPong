(function(){
  'user strict';
  angular
    .module("MatchApp")
    .filter("leagueFilter", leagueFilter);

    leagueFilter.$inject = ["REF","$firebaseArray"];

    function leagueFilter(fbref,$firebaseArray) {
      var ref = new Firebase(fbref);
      var leagues = $firebaseArray(ref.child('leagues'));

      return function(uid) {
        leagues.$loaded().then(function(){
          // console.log("leagueNickname", _.find(leagues, 'uid', uid).nickName);
          return _.find(leagues, 'uid', uid).nickName;
        });
      };
    }

})();
