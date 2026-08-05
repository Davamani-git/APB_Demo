(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .factory('AuthInterceptor', ['AuthContextService', function(AuthContextService){
      return {
        request: function(config){
          var token = AuthContextService.getToken();
          if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        }
      };
    }]);
})();
