(function() {
  'use strict';

  AppRun.$inject = ['$rootScope', 'LoggingService'];

  function AppRun($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      LoggingService.info('Route change started', {
        from: current ? current.$$route.originalPath : 'initial',
        to: next ? next.$$route.originalPath : 'unknown'
      });
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      LoggingService.info('Route change successful', {
        route: current ? current.$$route.originalPath : 'unknown'
      });
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      LoggingService.error('Route change error', {
        route: current ? current.$$route.originalPath : 'unknown',
        error: rejection
      });
    });
  }

  angular.module('davms.app').run(AppRun);
})();