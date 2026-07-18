(function() {
  'use strict';

  function HttpInterceptorFactory($q, ErrorHandlingService) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        return config;
      },
      response: function(response) {
        return response;
      },
      responseError: function(rejection) {
        ErrorHandlingService.classifyHttpError(rejection);
        return $q.reject(rejection);
      }
    };
  }

  HttpInterceptorFactory.$inject = ['$q', 'ErrorHandlingService'];

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();
