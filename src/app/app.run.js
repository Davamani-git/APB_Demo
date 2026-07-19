(function () {
  'use strict';

  run.$inject = ['$rootScope', 'EnvConfigService', 'LoggingService'];

  angular.module('app')
    .run(run)
    .controller('RootLayoutController', RootLayoutController);

  function run($rootScope, EnvConfigService, LoggingService) {
    // Load environment configuration at startup
    EnvConfigService.load().then(function () {
      LoggingService.info('Environment configuration loaded');
    }).catch(function (error) {
      LoggingService.error('Failed to load environment configuration', error);
    });

    // Global route error handling
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
      LoggingService.error('Route change error', {
        current: current,
        previous: previous,
        rejection: rejection
      });
    });
  }

  RootLayoutController.$inject = [];

  function RootLayoutController() {
    var layoutVm = this;

    layoutVm.appTitle = 'Monthly Spending Summary';
  }
})();
