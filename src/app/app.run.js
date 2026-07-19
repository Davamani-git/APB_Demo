(function () {
  'use strict';

  run.$inject = ['$rootScope', 'LoggingService', 'EnvConfigService'];

  angular
    .module('app')
    .run(run);

  function run($rootScope, LoggingService, EnvConfigService) {
    var initPromise = EnvConfigService.initialize();

    if (initPromise && angular.isFunction(initPromise.then)) {
      initPromise.catch(function (error) {
        LoggingService.error('Failed to initialize environment configuration', { error: error });
      });
    }

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      LoggingService.debug('Route change start', {
        next: next,
        current: current
      });
    });
  }
})();
