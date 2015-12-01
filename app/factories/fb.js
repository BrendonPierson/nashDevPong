(function(){
  'user strict';
  angular
    .module("MatchApp")
    .factory("fb", fb);

    fb.$inject = ["$firebaseAuth","$firebaseArray","$firebaseObject","REF"];

    function fb($firebaseAuth, $firebaseArray, $firebaseObject, fbref) {
      var ref = new Firebase(fbref);
      return {
        getRef: function(){
          return ref;
        },
        getUsersArr: function(){
          return $firebaseArray(ref.child("users"));
        },
        getAuthObj: function(){
          return $firebaseAuth(ref);
        },
        getLeagueArr: function(){
          return $firebaseArray(ref.child('leagues'));
        }
      };
    }
})();
