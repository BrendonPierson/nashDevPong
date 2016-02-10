(function(){
  'use strict';
  
  var ref = "https://nashdev-pong.firebaseio.com/";
  var defaultLeague = "-KACSdq_7yHEXcjjDP_V";

  angular
    .module("MatchApp")
    .constant('REF', ref)
    .constant('DefaultLeague', defaultLeague);

})();