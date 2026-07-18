(function() {
  'use strict';

  function AppRun($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      LoggingService.info('Route change started', { 
        from: current ? current.templateUrl : 'initial',
        to: next ? next.templateUrl : 'unknown'
      });
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      LoggingService.info('Route change completed', {
        route: current ? current.templateUrl : 'unknown'
      });
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      LoggingService.error('Route change failed', {
        route: current ? current.templateUrl : 'unknown',
        error: rejection
      });
    });
  }

  AppRun.$inject = ['$rootScope', 'LoggingService'];

  angular.module('davms.app')
    .run(AppRun);
})();