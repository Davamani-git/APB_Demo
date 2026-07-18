(function() {
  'use strict';

  AppRun.$inject = ['$rootScope', 'LoggingService'];

  function AppRun($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      LoggingService.info('Route change success', {
        current: current && current.originalPath,
        previous: previous && previous.originalPath
      });
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      LoggingService.error('Route change error', {
        current: current && current.originalPath,
        previous: previous && previous.originalPath,
        rejection: rejection
      });
    });
  }

  angular.module('davms.app').run(AppRun);
})();
