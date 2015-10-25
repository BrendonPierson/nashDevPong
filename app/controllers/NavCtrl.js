app.controller("NavCtrl", 
  ["$scope", 
  "$location",
  "$log",
  "$timeout",
  "$mdSidenav",
  "$firebaseAuth",
  "$firebaseArray",
  function($scope, $location, $log, $timeout, $mdSidenav, 
    $firebaseAuth, $firebaseArray) {

    var ref = new Firebase("https://nashdev-pong.firebaseio.com/");

    $scope.auth = $firebaseAuth(ref).$getAuth();

    $firebaseAuth(ref).$onAuth(function(authdata){
      $scope.auth = authdata;
    });

    var users = $firebaseArray(ref.child('users'));
  

    // var doublesTeams = $firebaseArray(ref.child('doublesTeams'));
    // doublesTeams.$loaded().then(function(){
    //   for (var i = doublesTeams.length - 1; i >= 0; i--) {
    //     doublesTeams[i].league = "-K1OjNXM8Q8WzQ0OrtIx";
    //     doublesTeams.$save(i);
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