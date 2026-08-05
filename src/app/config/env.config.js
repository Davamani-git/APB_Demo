(function () {
  'use strict';

  angular
    .module('execSummary.config')
    .constant('ENV_CONFIG', {
      env: 'APP_MRN39_EXEC_SUMMARY',
      apiBaseUrl: '',
      defaultRole: 'EDITOR',
      storageKeyScopes: 'EXEC_SCOPES',
      storageKeyTheme: 'EXEC_THEME',
      storageKeyLogs: 'EXEC_LOGS'
    });
})();