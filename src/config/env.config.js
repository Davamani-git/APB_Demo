(function () {
  'use strict';

  angular
    .module('apb.core')
    .constant('ENV_CONFIG', {
      apiBaseUrl: '',
      apiTimeoutMs: 8000,
      maxLookbackMonths: 24,
      enableClientRetry: true,
      maxClientRetries: 1,
      useMockApi: true
    });
})();
