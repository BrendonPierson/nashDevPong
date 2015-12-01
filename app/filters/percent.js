(function(){
  'user strict';
  angular
    .module("MatchApp")
    .filter("percent", percent);

    percent.$inject = ["$filter"];

    function percent($filter) {
      return function(input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
      };
    };
})();

