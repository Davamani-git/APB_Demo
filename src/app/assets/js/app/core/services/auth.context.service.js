(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .service('AuthContextService', [function(){
      var token = null;
      this.setToken = function(t){ token = t; };
      this.getToken = function(){ return token; };
      this.clear = function(){ token = null; };
    }]);
})();
