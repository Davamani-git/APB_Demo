(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('httpInterceptor', httpInterceptor);

  httpInterceptor.$inject = ['$q', 'LoggingService', 'ErrorModel'];

  function httpInterceptor($q, LoggingService, ErrorModel) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(rejection) {
        var error = new ErrorModel({
          statusCode: rejection.status,
          technicalMessage: rejection.statusText || 'HTTP error',
          userMessage: 'Unable to load data at this time. Please try again.',
          retryable: true
        });

        LoggingService.error('HTTP error', {
          status: rejection.status,
          url: rejection.config && rejection.config.url
        });

        return $q.reject(error);
      }
    };
  }
})();
