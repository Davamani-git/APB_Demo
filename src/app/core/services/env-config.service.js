(function () {
  'use strict';

  EnvConfigService.$inject = ['ENV_CONFIG', 'LoggingService'];

  function EnvConfigService(ENV_CONFIG, LoggingService) {
    var service = {
      initialize: initialize,
      isMockMode: isMockMode
    };
    return service;

    function initialize() {
      var mode = ENV_CONFIG.useMockData ? 'MOCK' : 'PRODUCTION';
      LoggingService.info('EnvConfigService initialized in ' + mode + ' mode.');
    }

    function isMockMode() {
      return !!ENV_CONFIG.useMockData;
    }
  }

  angular.module('davmsApp')
    .service('EnvConfigService', EnvConfigService);
})();
