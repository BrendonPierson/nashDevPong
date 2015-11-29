// app.controller("HomeCtrl", 
//   ["$scope",
//   function($scope) {
// }]);

(function() {
    'use strict';

    angular
      .module('MatchApp')
      .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl() { 
      var vm = this;
    }
})();