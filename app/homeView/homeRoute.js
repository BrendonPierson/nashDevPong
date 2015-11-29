(function() {
  'use strict';

  angular
    .module('MatchApp')
    .config(homeRoute);

  function homeRoute($routeProvider) {
    $routeProvider
      .when('/home', {
      templateUrl: 'homeView/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'vm'
    });
  }
})();