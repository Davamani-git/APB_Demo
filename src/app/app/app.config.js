(function () {
  'use strict';

  angular
    .module('execSummaryApp')
    .config(['$provide', '$httpProvider', '$logProvider', function ($provide, $httpProvider, $logProvider) {
      $logProvider.debugEnabled(true);

      $provide.decorator('$exceptionHandler', ['$delegate', 'ErrorHandlingService', function ($delegate, ErrorHandlingService) {
        return function (exception, cause) {
          $delegate(exception, cause);
          ErrorHandlingService.handleUnexpectedError(exception, cause);
        };
      }]);

      $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
      $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
    }]);
})();