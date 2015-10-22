app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    // returns the firebase authenication object that we acces in our LoginCtrl
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/matches");
    return $firebaseAuth(ref);
  }
]);