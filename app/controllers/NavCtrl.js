app.controller("NavCtrl", 
  ["$scope", 
  "$location",
  "$log",
  "$route",
  "$timeout",
  "$mdSidenav",
  "$firebaseAuth",
  "$firebaseArray",
  "league",
  function($scope, $location, $log, $route, $timeout, $mdSidenav, 
    $firebaseAuth, $firebaseArray, league) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.auth = $firebaseAuth(ref).$getAuth();

    $firebaseAuth(ref).$onAuth(function(authdata){
      $scope.auth = authdata;
    });

    var users = $firebaseArray(ref.child('users'));

    users.$loaded().then(function(){
      $scope.user = _.find(users, 'uid', ref.getAuth().uid);
      console.log("scope.user", $scope.user);
    });

    var leagues = $firebaseArray(ref.child('leagues'));
    leagues.$loaded().then(function(){
      $scope.leagues = leagues;
      $scope.currentLeague = _.find(leagues,'uid', $scope.user.league);
      console.log("currentLeague", $scope.currentLeague);
    });

    $scope.showChangeLeague = false;
    $scope.toggleChangeLeague = function(){
      $scope.showChangeLeague = $scope.showChangeLeague ? false : true;
    };

    $scope.showNewLeague = false;
    $scope.toggleNewLeague = function(){
      $scope.showNewLeague = $scope.showNewLeague ? false : true;
    };

    $scope.changeUserLeague = function(){
      ref.child('users/' + ref.getAuth().uid + '/league').set($scope.user.league);
      $scope.showChangeLeague = false;
      $route.reload();
    };

    // $scope.newleague = {};
    $scope.addNewLeague = function(){
      $scope.newleague.createdBy = ref.getAuth().uid;
      $scope.newleague.dateCreated = Date.now();
      $log.log("newleague", $scope.newleague);
      // Creating a var of the push allows the capture of the key 
      var pushRef = ref.child('leagues').push($scope.newleague);
      ref.child('leagues/' + pushRef.key() ).child('uid').set(pushRef.key());
      ref.child('users/' + $scope.user.uid + '/league').set(pushRef.key());
      $scope.showNewLeague = false;
      $scope.newleague = {};
      $route.reload();
    };
  
    /////////// Use this to manually manipulate firebase data //////////
    // var singlesMatches = $firebaseArray(ref.child('singlesMatches'));
    // singlesMatches.$loaded().then(function(){
    //   for (var i = singlesMatches.length - 1; i >= 0; i--) {
    //     singlesMatches[i].player1Rating = 1300;
    //     singlesMatches[i].player2Rating = 1300;
    //     singlesMatches.$save(i);
    //   };
    // });
    $log.log("authData: ", $scope.auth);

    $scope.login = function(){
      ref.authWithOAuthPopup("github", function(error, authData) { //1.firebase sends request for request token to github with client id and secret id
        if (error) {
          $log.log("Login Failed!", error);
        } else {
          $log.log("Authenticated successfully with payload:", authData);
          if(checkForUser(authData.uid)){
            $log.log("user exists");
            $log.log("authdata", authData);
          } else {
            $log.log("new user");
            addNewUser(authData);
          }
        }
      });
      // $location.path("/login");
    };

    $scope.logout = function() {
      $firebaseAuth(ref).$unauth();
      $scope.auth = null;
    };

    $scope.goHome = function(){
      $location.path('/home');
    };

    function addNewUser(data){
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
    }


    function checkForUser(uid){
      if(_.find(users, 'uid', uid)){
        return true;
      } else {
        return false;
      }
    }


    $scope.toggleLeft = buildDelayedToggler('left');

    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };

}]);