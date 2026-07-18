(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .run(appRun);

  appRun.$inject = ['$rootScope', 'EnvConfigService'];

  function appRun($rootScope, EnvConfigService) {
    var envConfig = EnvConfigService.getConfig();
    $rootScope.envLabel = envConfig.useMockData ? 'Mock' : 'Production';
  }
})();
