(function () {
  'use strict';

  EnvConfigFactory.$inject = [];

  angular
    .module('app')
    .factory('EnvConfig', EnvConfigFactory);

  function EnvConfigFactory() {
    function EnvConfig(options) {
      var opts = options || {};

      this.apiBaseUrl = typeof opts.apiBaseUrl === 'string' && opts.apiBaseUrl.length > 0
        ? opts.apiBaseUrl
        : 'https://api.example.com/v1';

      this.apiTimeoutMs = Number.isInteger(opts.apiTimeoutMs) && opts.apiTimeoutMs > 0
        ? opts.apiTimeoutMs
        : 10000;

      this.maxLookbackMonths = Number.isInteger(opts.maxLookbackMonths) && opts.maxLookbackMonths > 0
        ? opts.maxLookbackMonths
        : 12;

      this.useMockData = typeof opts.useMockData === 'boolean'
        ? opts.useMockData
        : true; // mock mode enabled by default

      this.featureFlags = opts.featureFlags || {
        enableBreakdownChart: true,
        showActiveDaysCount: true
      };

      this.telemetry = opts.telemetry || {
        logLevel: 'info',
        enableClientMetrics: true
      };
    }

    return EnvConfig;
  }
})();
