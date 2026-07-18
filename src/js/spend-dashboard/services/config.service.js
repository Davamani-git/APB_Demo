(function() {
  'use strict';

  ConfigService.$inject = ['$window'];

  function ConfigService($window) {
    var service = this;
    var useMockData = true;

    var config = {
      apiBaseUrl: 'https://api.bank.com/davms',
      telemetryEndpoint: 'https://telemetry.bank.com',
      featureFlags: {
        enhancedBreakdown: false,
        showDataFreshness: true
      }
    };

    service.getApiBaseUrl = function() {
      return config.apiBaseUrl;
    };

    service.getTelemetryEndpoint = function() {
      return config.telemetryEndpoint;
    };

    service.isFeatureEnabled = function(flagName) {
      return config.featureFlags[flagName] || false;
    };

    service.useMockData = function() {
      return useMockData;
    };

    service.setMockData = function(value) {
      useMockData = value;
    };

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();