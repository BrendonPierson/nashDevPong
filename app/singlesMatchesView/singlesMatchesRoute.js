(function() {
  'use strict';

  angular
    .module('MatchApp')
    .config(singlesMatchesRoute);

  singlesMatchesRoute.$inject = ["$routeProvider"];

  function singlesMatchesRoute($routeProvider) {
    $routeProvider.
    when('/singlesmatches', {
      templateUrl: 'singlesMatchesView/singlesmatches.html',
      controller: 'SinglesMatchesCtrl',
      controllerAs: 'vm',
      resolve: {
        "currentAuth": ["fb", function(fb) {
          return fb.getAuthObj().$requireAuth();
        }]
      }
    });
  }

  currentAuth.$inject = ['fb'];
  function currentAuth(fb) {
    return fb.getAuthObj().$requireAuth();
  }

})();