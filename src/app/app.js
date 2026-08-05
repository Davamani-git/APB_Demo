(function() {
  'use strict';
  angular
    .module('execDashboard.core', [])
    .module('execDashboard.kpi', [])
    .module('execDashboard.scope', [])
    .module('execDashboard.config', [])
    .module('execDashboard.resilience', []);

  angular
    .module('execDashboardApp', [
      'ngRoute',
      'ngAnimate',
      'ngSanitize',
      'execDashboard.core',
      'execDashboard.kpi',
      'execDashboard.scope',
      'execDashboard.config',
      'execDashboard.resilience'
    ])
    .run(appRun);

  appRun.$inject = ['StorageService', 'ValidationService', 'DataStoreService', 'LoggingService'];
  function appRun(StorageService, ValidationService, DataStoreService, LoggingService) {
    StorageService.loadState()
      .then(function(state) {
        if (state) {
          var validation = ValidationService.validateLoadedState(state);
          if (validation.valid) {
            DataStoreService.initialize(state);
          } else {
            LoggingService.warn('Persisted state invalid, initializing defaults', validation);
            DataStoreService.initializeDefaults();
          }
        } else {
          DataStoreService.initializeDefaults();
        }
      })
      .catch(function() {
        LoggingService.error('Failed to load state, initializing defaults');
        DataStoreService.initializeDefaults();
      });
  }
})();
