(function () {
  'use strict';

  config.$inject = ['$provide'];

  function config($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerService',
      function ($delegate, exceptionHandlerService) {
        return function (exception, cause) {
          exceptionHandlerService.handleException(exception, cause);
          $delegate(exception, cause);
        };
      }
    ]);
  }

  angular.module('app')
    .config(config);
})();
