
var app = angular.module("MatchApp", ['ngRoute', 'firebase', 'ngMaterial', 'ngMdIcons']);

// This first part tells the app that auth is required, 
//if the user isn't logged in it redirects to the login page
app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the login page
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  });
}]);

// This designates the view and controller based on the route
// The resolve bit is what prevents a user from seeing anything untill they 
// are logged in.  Note: I added routes that don't currently exist, 
// but I think eventually will?
app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/singlesrank', {
      templateUrl: 'partials/singlesrank.html',
      controller: 'SinglesRankCtrl',
      resolve: {
        "currentAuth": ["fb", function(fb) {
          return fb.getAuthObj().$requireAuth();
        }]
      }
    }).
    when('/doublesrank', {
      templateUrl: 'partials/doublesrank.html',
      controller: 'DoublesRankCtrl',
      resolve: {
        "currentAuth": ["fb", function(fb) {
          return fb.getAuthObj().$requireAuth();
        }]
      }
    })
    // when('/board/:id', {
    //   templateUrl: 'partials/singleBoard.html',
    //   controller: 'SingleBoardCtrl',
    //   resolve: {
    //     "currentAuth": ["Auth", function(Auth) {
    //       return Auth.$requireAuth();
    //     }]
    //   }
    // }).
    .when('/singlesmatches', {
      templateUrl: 'partials/matches.html',
      controller: 'SinglesMatchesCtrl',
      resolve: {
        "currentAuth": ["fb", function(fb) {
          return fb.getAuthObj().$requireAuth();
        }]
      }
    }).
    when('/doublesmatches', {
      templateUrl: 'partials/doublesmatches.html',
      controller: 'DoublesMatchesCtrl',
      resolve: {
        "currentAuth": ["fb", function(fb) {
          return fb.getAuthObj().$requireAuth();
        }]
      }
    }).
    when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl',
      resolve: {
        "currentAuth": ["fb", function(fb) {
          return fb.getAuthObj().$waitForAuth();
        }]
      }
    }).
    otherwise({
      redirectTo: '/home'
    });
}]);
