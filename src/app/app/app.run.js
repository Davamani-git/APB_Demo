(function () {
  'use strict';

  angular
    .module('ccdDashboardApp')
    .run([
      '$rootScope',
      '$location',
      'authTokenService',
      'loggingService',
      'errorHandlerService',
      function ($rootScope, $location, authTokenService, loggingService, errorHandlerService) {
        var correlationId = generateCorrelationId();
        $rootScope.correlationId = correlationId;

        $rootScope.$on('$routeChangeStart', function (event, next) {
          var token = authTokenService.getAccessToken();
          if (next && next.resolve && next.resolve.authGuard && !token) {
            event.preventDefault();
            loggingService.warn('Unauthorized route access attempt to ' + $location.path());
            $location.path('/');
          }
        });

        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
          var errorModel = errorHandlerService.handleClientError(rejection);
          $rootScope.$broadcast('globalError', errorModel);
        });

        function generateCorrelationId() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
      }
    ]);
})();
