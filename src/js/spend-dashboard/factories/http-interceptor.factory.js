(function () {
  'use strict';

  HttpInterceptorFactory.$inject = ['$q', 'ErrorHandlingService'];

  function HttpInterceptorFactory($q, ErrorHandlingService) {
    return {
      request: function (config) {
        // In a real implementation, auth tokens would be attached here.
        return config;
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        var errorModel = ErrorHandlingService.classifyHttpError(rejection);
        return $q.reject(errorModel);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .factory('HttpInterceptorFactory', HttpInterceptorFactory);
})();
