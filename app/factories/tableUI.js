(function(){
  'user strict';
  angular
    .module("MatchApp")
    .factory("tableUI", tableUI);

    tableUI.$inject = ["$q","$timeout"];

    function tableUI($q,$timeout) {
      return {
        query: {
          order: '-date',
          limit: 5,
          page: 1
        },
        onpagechange: function(page, limit) {
          var deferred = $q.defer();
          
          $timeout(function () {
            deferred.resolve();
          }, 2000);
          
          return deferred.promise;
        },
        onorderchange: function(order) {
          var deferred = $q.defer();
          
          $timeout(function () {
            deferred.resolve();
          }, 2000);
          
          return deferred.promise;
        }
      };
    }

})();