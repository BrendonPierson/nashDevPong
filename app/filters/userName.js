app.filter('userName', [
  "fb",
  function(fb) {
    var users = fb.getUsersArr();

    return function(uid) {
      return _.find(users, 'uid', uid).userName;
    };
  }
]);