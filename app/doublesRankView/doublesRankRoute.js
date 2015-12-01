(function() {
  'use strict';

  angular
    .module('MatchApp')
    .config(doublesRankRoute);

  doublesRankRoute.$inject = ["$routeProvider"];

  function doublesRankRoute($routeProvider) {
    $routeProvider.
    when('/doublesrank', {
      templateUrl: 'doublesRankView/doublesrank.html',
      controller: 'DoublesRankCtrl',
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