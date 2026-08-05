(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('ApiService', ApiService);

  ApiService.$inject = ['ENV_CONFIG'];
  function ApiService(ENV_CONFIG) {
    this.syncStateToServer = function(state) {
      if (!ENV_CONFIG.featureFlags.futureApiIntegration) {
        return;
      }
    };

    this.loadStateFromServer = function() {
      if (!ENV_CONFIG.featureFlags.futureApiIntegration) {
        return null;
      }
      return null;
    };
  }
})();
