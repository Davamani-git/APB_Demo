(function() {
  'use strict';

  HttpInterceptorFactory.$inject = ['$q', 'ErrorHandlingService'];

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
        var errorModel = ErrorHandlingService.classifyHttpError(rejection);
        return $q.reject(errorModel);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();
