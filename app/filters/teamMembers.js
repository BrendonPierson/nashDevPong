app.filter('teamMembers', [
  "fb",
  function(fb) {
    var users = fb.getUsersArr();

    return function(uid) {
      var uids = uid.split("-");
      var p1 = _.find(users, 'uid', uids[0]).displayName;
      var p2 = _.find(users, 'uid', uids[1]).displayName;

      return p1 + " & " + p2;
    };
  }
]);