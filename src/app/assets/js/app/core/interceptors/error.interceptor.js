(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .factory('ErrorInterceptor', ['$q', '$rootScope', function($q, $rootScope){
      return {
        responseError: function(rejection){
          if(rejection && rejection.status === 401){
            $rootScope.$broadcast('auth:logout');
          }
          return $q.reject(rejection.data || rejection);
        }
      };
    }]);
})();
