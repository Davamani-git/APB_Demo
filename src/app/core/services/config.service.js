(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('ConfigService', ConfigService);

  ConfigService.$inject = ['ENV_CONFIG', 'ConfigModel'];
  function ConfigService(ENV_CONFIG, ConfigModel) {
    var config = ConfigModel.create({
      featureFlags: {
        futureApiIntegration: ENV_CONFIG.featureFlags && ENV_CONFIG.featureFlags.futureApiIntegration === true
      }
    });

    this.getConfig = function() {
      return angular.copy(config);
    };

    this.isFeatureEnabled = function(featureKey) {
      if (!config.featureFlags) {
        return false;
      }
      return config.featureFlags[featureKey] === true;
    };
  }
})();
