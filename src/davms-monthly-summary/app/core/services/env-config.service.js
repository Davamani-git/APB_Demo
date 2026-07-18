(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('EnvConfigService', EnvConfigService);

  EnvConfigService.$inject = ['ENV_CONFIG'];

  function EnvConfigService(ENV_CONFIG) {
    this.getConfig = function() {
      return ENV_CONFIG;
    };

    this.isMockMode = function() {
      return !!ENV_CONFIG.useMockData;
    };
  }
})();
