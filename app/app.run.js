(function(){
  'use strict';
  
  angular
    .module("MatchApp")

    .run(run)

  run.$inject = ["$rootScope", "$location"];

  function run ($rootScope, $location){
    $rootScope.$on("$routeChangeError", runCallBack);
  }

  function runCallBack(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  }

})();