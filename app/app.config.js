(function(){
  'use strict';
  angular
    .module("MatchApp")

    .config(config);

  config.$inject = ["$routeProvider"];

  function config ($routeProvider){
    $routeProvider
      .otherwise({
        redirectTo: '/home'
      });
  }

})();