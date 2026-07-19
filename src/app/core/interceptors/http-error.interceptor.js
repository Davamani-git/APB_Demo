(function () {
  'use strict';

  HttpErrorInterceptor.$inject = ['$q', 'LoggingService'];

  angular.module('app')
    .factory('HttpErrorInterceptor', HttpErrorInterceptor);

  function HttpErrorInterceptor($q, LoggingService) {
    return {
      responseError: function (rejection) {
        LoggingService.error('HTTP response error', {
          status: rejection.status,
          data: rejection.data,
          config: rejection.config
        });
        return $q.reject(rejection);
      }
    };
  }
})();
