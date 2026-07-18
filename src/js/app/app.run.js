(function() {
  'use strict';

  AppRun.$inject = ['$rootScope', 'LoggingService'];

  function AppRun($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
      LoggingService.info('Route change started', { next: next && next.originalPath });
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
      LoggingService.info('Route change succeeded', { current: current && current.originalPath });
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      LoggingService.error('Route change error', { current: current && current.originalPath, rejection: rejection });
    });
  }

  angular.module('davms.app')
    .run(AppRun);
})();
