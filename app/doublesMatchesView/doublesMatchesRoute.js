(function() {
  'use strict';

  angular
    .module('MatchApp')
    .config(doublesMatchesRoute);

  doublesMatchesRoute.$inject = ["$routeProvider"];

  function doublesMatchesRoute($routeProvider) {
    $routeProvider
    .when('/doublesmatches', {
      templateUrl: 'doublesMatchesView/doublesmatches.html',
      controller: 'DoublesMatchesCtrl',
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