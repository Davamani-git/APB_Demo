'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .run(appRun);

  appRun.$inject = ['$rootScope', '$state', 'SecurityContextService', 'LoggingService'];

  function appRun($rootScope, $state, SecurityContextService, LoggingService) {
    SecurityContextService.initialize().finally(function () {
      if ($state.current && !$state.current.name) {
        $state.go('insightsDashboard');
      }
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      LoggingService.error('State change error', { toState: toState.name, error: error });
    });

    $rootScope.$on('insights:refresh', function () {
      LoggingService.info('Global insights refresh requested');
    });
  }
})();
