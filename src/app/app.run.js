(function () {
  'use strict';

  angular.module('app')
    .run(['$rootScope', 'authTokenService', 'telemetryService',
      function ($rootScope, authTokenService, telemetryService) {
        $rootScope.$on('$routeChangeStart', function (evt, next) {
          telemetryService.beginNavigation(next && next.originalPath);
          if (!authTokenService.hasValidToken()) {
            telemetryService.logSecurityEvent('MISSING_TOKEN', { path: next && next.originalPath });
          }
        });

        $rootScope.$on('$routeChangeSuccess', function (evt, current) {
          telemetryService.endNavigation(current && current.originalPath);
        });
      }
    ]);
}());
