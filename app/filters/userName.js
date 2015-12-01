(function(){
  'user strict';
  angular
    .module("MatchApp")
    .filter("userName", userName);

    userName.$inject = ["fb"];

    function userName(fb) {
      var users = fb.getUsersArr();

      return function(uid) {
        return _.find(users, 'uid', uid).userName;
      };
    }
})();