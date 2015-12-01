(function(){
  'user strict';
  angular
    .module('MatchApp')
    .controller('NavCtrl', NavCtrl);

  NavCtrl.$inject = ["$location","$log","$route","$timeout","$mdSidenav",
    "$firebaseAuth","$firebaseArray","addNewUser","REF"];

  function NavCtrl($location, $log, $route, $timeout, $mdSidenav, 
    $firebaseAuth, $firebaseArray, newUser, fbref) {

    var vm = this;

    var ref = new Firebase(fbref);

    // Returns the current auth object or null if not logged in
    vm.auth = $firebaseAuth(ref).$getAuth();

    // Callback function fires everytime the auth status changes
    $firebaseAuth(ref).$onAuth(function(authdata){
      vm.auth = authdata;
      // Once users are loaded, find the user object based on the uid of the auth obj
      users.$loaded().then(function(){
        vm.user = _.find(users, 'uid', authdata.uid);
        vm.currentLeague = _.find(leagues,'uid', vm.user.league);
        console.log("scope.user", vm.user);
      });
    });

    var users = $firebaseArray(ref.child('users'));

    // Once users are loaded, find the user object based on the uid of the auth obj
    users.$loaded().then(function(){
      vm.user = _.find(users, 'uid', ref.getAuth().uid);
      console.log("scope.user", vm.user);
    });

    // Find current league based on the users current league property
    var leagues = $firebaseArray(ref.child('leagues'));
    leagues.$loaded().then(function(){
      vm.leagues = leagues;
      vm.currentLeague = _.find(leagues,'uid', vm.user.league);
      console.log("currentLeague", vm.currentLeague);
    });

    // Start off with change league for hidden, toggle on button click
    vm.showChangeLeague = false;
    vm.toggleChangeLeague = function(){
      vm.showChangeLeague = vm.showChangeLeague ? false : true;
      vm.showNewLeague = false;
    };
    // Initially hide new league form, toggle on click
    vm.showNewLeague = false;
    vm.toggleNewLeague = function(){
      vm.showNewLeague = vm.showNewLeague ? false : true;
      vm.showChangeLeague = false;
    };
    // Function sets the users firebase league key to the selected league
    vm.changeUserLeague = function(){
      ref.child('users/' + ref.getAuth().uid + '/league').set(vm.user.league);
      vm.showChangeLeague = false;
      // The reload changes the data when the league changes
      vm.currentLeague = _.find(leagues,'uid', vm.user.league);
      $route.reload();
      vm.close();
    };

    // Function to add a new league based on user entered data
    vm.newleague = {};
    vm.addNewLeague = function(){
      vm.newleague.createdBy = ref.getAuth().uid;
      vm.newleague.dateCreated = Date.now();
      $log.log("newleague", vm.newleague);
      // Creating a var of the push allows the capture of the key 
      var pushRef = ref.child('leagues').push(vm.newleague);
      ref.child('leagues/' + pushRef.key() ).child('uid').set(pushRef.key());
      ref.child('users/' + vm.user.uid + '/league').set(pushRef.key());
      vm.showNewLeague = false;
      vm.newleague = {};
      vm.currentLeague = _.find(leagues,'uid', vm.user.league);
      $route.reload();
      vm.close();
    };

    $log.log("authData: ", vm.auth);

    vm.login = function(){
      // Oauth login with github
      ref.authWithOAuthPopup("github", function(error, authData) { 
        if (error) {
          $log.log("Login Failed!", error);
        } else {
          $log.log("Authenticated successfully with payload:", authData);
          // Check for user, if they don't exist add them
          if(newUser.checkForUser(authData.uid, users)){
            $log.log("user exists");
            $log.log("authdata", authData);
            $location.path("/singlesmatches");
          } else {
            $log.log("new user");
            newUser.add(authData);
            $location.path("/singlesmatches");
          }
        }
      });
    };

    // Nav bar link paths
    vm.logout = function() {
      $firebaseAuth(ref).$unauth();
      vm.auth = null;
      $location.path("/home");
    };
    vm.goHome = function(){
      $location.path('/home');
    };

    // Everything below is the Side nav logic directly from Angular Material
    vm.toggleLeft = buildDelayedToggler('left');
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = vm,
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
    vm.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  }
})();
