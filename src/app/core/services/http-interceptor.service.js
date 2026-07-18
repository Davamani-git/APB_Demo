(function () {
  'use strict';

  HttpInterceptorService.$inject = ['$q', 'LoggingService', 'ErrorMappingService'];

  function HttpInterceptorService($q, LoggingService, ErrorMappingService) {
    return {
      request: function (config) {
        // Add common headers if necessary, e.g. trace IDs.
        return config;
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        var errorModel = ErrorMappingService.mapHttpError(rejection);
        LoggingService.error('HTTP error intercepted', errorModel);
        return $q.reject(errorModel);
      }
    };
  }

  angular.module('davmsApp')
    .factory('HttpInterceptorService', HttpInterceptorService);
})();
