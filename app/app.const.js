(function(){
  'use strict';
  
  var ref = "https://nashdev-pong.firebaseio.com/";
  var defaultLeague = "-K1OjDAX9cALaca8PGQh";

  angular
    .module("MatchApp")
    .constant('REF', ref)
    .constant('DefaultLeague', defaultLeague);

})();