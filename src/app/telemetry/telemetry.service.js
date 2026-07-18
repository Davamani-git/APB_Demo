(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('TelemetryService', TelemetryService);

  TelemetryService.$inject = ['$injector', 'EnvConfigService'];

  function TelemetryService($injector, EnvConfigService) {
    var self = this;
    var config = null;

    self.initialize = function() {
      var $http = $injector.get('$http');
      $http.get('app/core/config/telemetry.config.json')
        .then(function(response) {
          config = response.data && response.data.telemetry ? response.data.telemetry : null;
        })
        .catch(function() {
          config = null;
        });
    };

    self.trackEvent = function(name, properties) {
      try {
        var Env = EnvConfigService.getEnvConfig();
        if (!Env.telemetryEnabled || !config || !config.endpoint) {
          return;
        }
        var $http = $injector.get('$http');
        $http.post(config.endpoint, {
          name: name,
          properties: properties || {},
          timestamp: new Date().toISOString()
        }).catch(function() {
          // swallow
        });
      } catch (e) {
        // swallow
      }
    };
  }
})();
