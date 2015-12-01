(function(){
  'user strict';
  angular
    .module("MatchApp")
    .factory("Auth", Auth);

    Auth.$inject = ["REF","$firebaseAuth"];

    function Auth(fbref,$firebaseAuth) {
      var ref = new Firebase(fbref);
      return $firebaseAuth(ref);
    }

})();