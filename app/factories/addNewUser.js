app.factory("addNewUser", 
  function() {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    return {
      add: function(data){
        var newUser = {};
        newUser.displayName = data.github.displayName;
        newUser.userName = data.github.username;
        newUser.uid = data.uid;
        newUser.eloRating = 1300;
        newUser.wins = [];
        newUser.losses = [];
        newUser.winNum = 0;
        newUser.lossNum = 0;
        newUser.league = "-K1OjNXM8Q8WzQ0OrtIx";
        newUser.profileImageUrl = data.github.profileImageURL;
        newUser.dateAdded = Date.now();

        ref.child('users').child(newUser.uid).set(newUser);
      },
      checkForUser: function (uid, users){
        if(_.find(users, 'uid', uid)){
          return true;
        } else {
          return false;
        }
      }  
  };
});