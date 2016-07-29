(function(){
  'user strict';
  angular
    .module("MatchApp")
    .filter("teamMembers", teamMembers);

    teamMembers.$inject = ["fb"];

    function teamMembers(fb) {
        var users = fb.getUsersArr();

      return function (uid) {
          var uids = uid.split("-");
          console.log("uid", uid)
          var searchP1UID = uids[0] + "-" + uids[1] + "-" + uids[2] + "-" + uids[3] + "-" + uids[4];
          var searchP2UID = uids[5] + "-" + uids[6] + "-" + uids[7] + "-" + uids[8] + "-" + uids[9];
          var p1 = _.find(users, 'uid', searchP1UID).userName;
          console.log("p1", p1);
        var p2 = _.find(users, 'uid', searchP2UID).userName;
        return p1 + " & " + p2;
      };
    }
})();
