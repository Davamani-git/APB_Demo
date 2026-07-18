(function() {
  'use strict';

  AppRun.$inject = ['$rootScope', 'LoggingService'];

  function AppRun($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
      var path = current && current.originalPath ? current.originalPath : 'unknown';
      LoggingService.info('Route change success', { path: path });
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      var path = current && current.originalPath ? current.originalPath : 'unknown';
      LoggingService.error('Route change error', { path: path, rejection: rejection });
    });
  }

  angular.module('davms.app').run(AppRun);
})();
