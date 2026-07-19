(function () {
  'use strict';

  ConfigService.$inject = ['$http', '$q', 'ENV_DEFAULT_PATH'];

  function ConfigService($http, $q, ENV_DEFAULT_PATH) {
    var configCache = null;

    function loadConfig() {
      if (configCache) {
        return $q.resolve(configCache);
      }
      return $http.get(ENV_DEFAULT_PATH)
        .then(function (response) {
          configCache = response.data;
          return configCache;
        });
    }

    function getConfig() {
      return loadConfig();
    }

    function getFeatureFlag(flagName) {
      return loadConfig().then(function (cfg) {
        return !!(cfg.featureFlags && cfg.featureFlags[flagName]);
      });
    }

    function isMockEnabled() {
      return loadConfig().then(function (cfg) {
        return !!cfg.useMockData;
      });
    }

    return {
      getConfig: getConfig,
      getFeatureFlag: getFeatureFlag,
      isMockEnabled: isMockEnabled
    };
  }

  angular.module('app')
    .service('configService', ConfigService);
})();
