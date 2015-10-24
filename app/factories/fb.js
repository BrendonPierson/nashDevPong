app.factory("fb", [
  "$firebaseAuth",
  "$firebaseArray",
  "$firebaseObject",
  function($firebaseAuth, $firebaseArray, $firebaseObject) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

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
]);