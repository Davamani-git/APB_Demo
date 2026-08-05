(function () {
  'use strict';

  angular
    .module('timerApp')
    .constant('ENV_CONFIG', {
      env: 'dev',
      apiBaseUrl: 'https://api.example.com',
      enableStorage: true,
      logLevel: 'info',
      enableRemoteLogging: false
    });
})();
