(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .service('BaseHttpService', ['$http', '$q', 'AuthContextService', function($http, $q, AuthContextService){
      this.get = function(url, config){
        var cfg = config || {};
        return $http.get(url, cfg).catch(function(response){
          return $q.reject(response.data || response);
        });
      };
      this.post = function(url, data, config){
        var cfg = config || {};
        return $http.post(url, data, cfg).catch(function(response){
          return $q.reject(response.data || response);
        });
      };
    }]);
})();
