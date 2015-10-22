app.factory("fb", [
  "$firebaseAuth",
  "$firebaseArray",
  function($firebaseAuth, $firebaseArray) {

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
      }
    };
    
  }
]);