(function() {
  'use strict';

  HttpInterceptorFactory.$inject = ['$q', '$injector'];

  function HttpInterceptorFactory($q, $injector) {
    return {
      request: function(config) {
        var mockToken = 'mock-bearer-token-12345';
        config.headers = config.headers or {};
        config.headers['Authorization'] = 'Bearer ' + mockToken;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },

      response: function(response) {
        return response;
      },

      responseError: function(rejection) {
        var ErrorHandlingService = $injector.get('ErrorHandlingService');
        var LoggingService = $injector.get('LoggingService');

        var errorModel = ErrorHandlingService.classifyHttpError(rejection);
        LoggingService.error('HTTP request failed', {
          url: rejection.config ? rejection.config.url : 'unknown',
          status: rejection.status,
          errorType: errorModel.type
        });

        if (rejection.status === 401) {
          console.warn('Unauthorized access - session expired');
        }

        return $q.reject(rejection);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();