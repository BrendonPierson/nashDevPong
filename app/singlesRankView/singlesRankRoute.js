(function() {
  'use strict';

  angular
    .module('MatchApp')
    .config(singlesRankRoute);

  singlesRankRoute.$inject = ["$routeProvider"];

  function singlesRankRoute($routeProvider) {
    $routeProvider.
    when('/singlesrank', {
      templateUrl: 'singlesRankView/singlesrank.html',
      controller: 'SinglesRankCtrl',
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