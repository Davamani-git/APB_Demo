(function() {
  'use strict';

  HttpInterceptorFactory.$inject = ['$q', 'ErrorHandlingService'];

  function HttpInterceptorFactory($q, ErrorHandlingService) {
    return {
      request: function(config) {
        // Attach auth token from a secure cookie or header. For demo, we assume backend handles auth.
        return config;
      },
      response: function(response) {
        return response;
      },
      responseError: function(rejection) {
        // Let ErrorHandlingService classify; controllers/services will receive error model.
        ErrorHandlingService.classifyHttpError(rejection);
        return $q.reject(rejection);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();
