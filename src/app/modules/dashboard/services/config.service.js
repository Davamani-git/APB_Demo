(function() {
  'use strict';

  ConfigService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggingService', 'ConfigModel'];

  function ConfigService($http, $q, ENV_CONFIG, LoggingService, ConfigModel) {
    this.getConfig = function() {
      var deferred = $q.defer();

      if (ENV_CONFIG.useMockData) {
        if (window.ConfigMockData) {
          deferred.resolve(new ConfigModel(window.ConfigMockData));
          return deferred.promise;
        }
        deferred.reject('Mock config not available');
        return deferred.promise;
      }

      var url = ENV_CONFIG.apiBaseUrl + '/spending-config';
      $http({
        method: 'GET',
        url: url,
        timeout: ENV_CONFIG.apiTimeoutMs
      }).then(function(response) {
        deferred.resolve(new ConfigModel(response.data || {}));
      }).catch(function(error) {
        LoggingService.error('ConfigService API error', { error: error });
        deferred.reject(error);
      });

      return deferred.promise;
    };
  }

  angular.module('app')
    .service('ConfigService', ConfigService);
})();
