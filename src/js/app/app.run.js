(function() {
  'use strict';

  AppRun.$inject = ['$rootScope', 'LoggingService'];

  function AppRun($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
      var path = current && current.originalPath ? current.originalPath : 'unknown';
      LoggingService.info('Route change success', { path: path });
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      LoggingService.error('Route change error', {
        current: current && current.originalPath,
        previous: previous && previous.originalPath,
        rejection: rejection
      });
    });
  }

  angular.module('davms.app')
    .run(AppRun);
})();
