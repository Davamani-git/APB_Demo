(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .factory('ConfigModel', ConfigModel);

  function ConfigModel() {
    var prototype = {
      themeId: 'default',
      showAgentificationTiles: true,
      showWorkflowTiles: true,
      showApbTiles: true,
      enableConsistencyChecks: true,
      dataSourceNote: '',
      featureFlags: {
        futureApiIntegration: false
      }
    };

    return {
      create: function(data) {
        var config = angular.copy(prototype);
        angular.extend(config, data || {});
        return config;
      }
    };
  }
})();
