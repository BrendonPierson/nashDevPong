(function() {
  'use strict';

  angular
    .module('MatchApp')
    .config(userStatsRoute);

  function userStatsRoute($routeProvider) {
    $routeProvider
      .when('/stats/:id', {
      templateUrl: 'userStatsView/userStats.html',
      controller: 'UserStatsCtrl',
      controllerAs: 'vm',
      resolve: {
        "currentAuth": currentAuth
      }
    });
  }

  currentAuth.$inject = ['fb'];
  function currentAuth(fb) {
    return fb.getAuthObj().$requireAuth();
  }

})();