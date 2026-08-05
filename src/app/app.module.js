(function () {
  'use strict';

  angular.module('creditCardDashboardApp', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'ui.bootstrap',
    'ccd.dashboard'
  ])
  .factory('$exceptionHandler', ['$injector', function ($injector) {
    return function (exception, cause) {
      var LoggingService = $injector.get('LoggingService');
      LoggingService.error('Unhandled exception', { exception: exception, cause: cause });
    };
  }]);
})();
