(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('EnvConfigService', EnvConfigService);

  EnvConfigService.$inject = ['$http', '$q', 'LoggingService'];

  function EnvConfigService($http, $q, LoggingService) {
    var self = this;
    var envConfig = null;

    self.loadEnvConfig = function() {
      if (envConfig) {
        return $q.resolve(envConfig);
      }

      var deferred = $q.defer();

      $http.get('app/core/config/env.config.json')
        .then(function(response) {
          envConfig = response.data && response.data.ENV_CONFIG ? response.data.ENV_CONFIG : {};
          if (typeof envConfig.useMockData === 'undefined') {
            envConfig.useMockData = true;
          }
          if (typeof envConfig.apiTimeoutMs === 'undefined') {
            envConfig.apiTimeoutMs = 8000;
          }
          deferred.resolve(envConfig);
        })
        .catch(function(error) {
          LoggingService.error('Failed to load env.config.json', error);
          envConfig = {
            environmentName: 'DEV',
            apiBaseUrl: 'https://api.dev.davms.example.com',
            apiTimeoutMs: 8000,
            maxLookbackMonths: 24,
            useMockData: true,
            telemetryEnabled: true
          };
          deferred.resolve(envConfig);
        });

      return deferred.promise;
    };

    self.getEnvConfig = function() {
      return envConfig || {
        environmentName: 'DEV',
        apiBaseUrl: 'https://api.dev.davms.example.com',
        apiTimeoutMs: 8000,
        maxLookbackMonths: 24,
        useMockData: true,
        telemetryEnabled: true
      };
    };
  }
})();
