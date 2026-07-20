(function () {
  'use strict';

  // Optional wrapper if needed for future extension; kept minimal here
  angular.module('apbDemo')
    .service('EnvConfigWrapperService', EnvConfigWrapperService);

  EnvConfigWrapperService.$inject = ['EnvConfigService'];

  function EnvConfigWrapperService(EnvConfigService) {
    var service = this;

    service.loadAndGetConfig = loadAndGetConfig;

    function loadAndGetConfig() {
      return EnvConfigService.loadConfig().then(function (config) {
        return config;
      });
    }
  }
})();
