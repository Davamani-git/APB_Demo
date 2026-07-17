(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .service('InsightsConfigService', InsightsConfigService);

  InsightsConfigService.$inject = ['ApiGatewayService', 'EnvConfig'];

  function InsightsConfigService(ApiGatewayService, EnvConfig) {
    let configCache = null;

    this.getConfig = function () {
      if (configCache) {
        return Promise.resolve(configCache);
      }
      return ApiGatewayService.get('INSIGHTS', '/config')
        .then(function (data) {
          configCache = data;
          return configCache;
        })
        .catch(function () {
          // Fallback to EnvConfig defaults if available
          configCache = {
            categories: [],
            featureFlags: EnvConfig.FEATURE_FLAGS,
            maxDateRangeDays: EnvConfig.maxDateRangeDays
          };
          return configCache;
        });
    };

    this.isFeatureEnabled = function (flagName) {
      const flags = (configCache && configCache.featureFlags) || EnvConfig.FEATURE_FLAGS || {};
      return !!flags[flagName];
    };
  }
})();
