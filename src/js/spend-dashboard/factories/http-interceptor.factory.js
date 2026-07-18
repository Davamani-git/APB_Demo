(function() {
  'use strict';

  HttpInterceptorFactory.$inject = ['$q', 'ErrorHandlingService'];

  function HttpInterceptorFactory($q, ErrorHandlingService) {
    return {
      request: function(config) {
        // Authorization tokens are assumed to be handled by the platform
        // (e.g., via cookies or existing headers). No additional token logic
        // is introduced here beyond the LLD.
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

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();
