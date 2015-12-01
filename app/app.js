
var app = angular.module("MatchApp", 
  ['ngRoute', 'firebase', 'ngMaterial', 'md.data.table', 'ngMdIcons']);

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
// are logged in. 
app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .otherwise({
      redirectTo: '/home'
    });
}]);
