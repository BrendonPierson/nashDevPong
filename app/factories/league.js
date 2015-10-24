app.factory("league", [
  "$q",
  "$firebaseArray",
  function($q, $firebaseArray) {
    var ref = new Firebase("https://nashdev-pong.firebaseio.com/")
    var users = $firebaseArray(ref.child('users'));
    var uid = ref.getAuth().uid;
    var league = '';

    return {
      getLeague: function(){
        return $q(function(resolve, reject){
          users.$loaded().then(function(){
            var league = _.find(users, 'uid', uid).league;
            resolve(league);
          });
        });
      }
    };
    
  }
]);

