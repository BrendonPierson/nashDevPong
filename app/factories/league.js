(function(){
  'user strict';
  angular
    .module("MatchApp")
    .factory("league", league);

    league.$inject = ["$q","$firebaseArray","REF"];

    function league($q,$firebaseArray,fbref) {
      console.log("ref", fbref);
      var ref = new Firebase(fbref);
      var users = $firebaseArray(ref.child('users'));
      var uid = ref.getAuth().uid;
      var league = '';

      return {
        getLeague: function(){
          return $q(function(resolve, reject){
            users.$loaded().then(function(){
              var league = _.find(users, 'uid', uid).league;
              resolve(league);
            });
          });
        }
      };
    }

})();
