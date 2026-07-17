(function () {
  'use strict';

  angular
    .module('apb.core')
    .constant('ENV_CONFIG', {
      apiBaseUrl: 'https://api.example.com',
      apiTimeoutMs: 8000,
      maxLookbackMonths: 24,
      enableClientRetry: false,
      maxClientRetries: 1
    });
})();
