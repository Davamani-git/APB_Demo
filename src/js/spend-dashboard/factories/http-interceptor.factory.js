(function() {
  'use strict';

  function HttpInterceptorFactory($q, ErrorHandlingService) {
    return {
      request: function(config) {
        // Add auth token if available (in real implementation, this would come from auth service)
        var token = 'mock-auth-token-12345';
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        
        config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
        return config;
      },
      
      response: function(response) {
        return response;
      },
      
      responseError: function(rejection) {
        var errorModel = ErrorHandlingService.classifyHttpError(rejection);
        
        // Handle specific error types
        if (errorModel.type === 'auth') {
          // In real implementation, redirect to login
          console.warn('Authentication error detected:', errorModel);
        }
        
        return $q.reject(errorModel);
      }
    };
  }

  HttpInterceptorFactory.$inject = ['$q', 'ErrorHandlingService'];

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();