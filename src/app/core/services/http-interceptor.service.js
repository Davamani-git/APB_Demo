(function () {
  'use strict';

  HttpInterceptorService.$inject = ['EnvConfigService'];

  angular.module('app')
    .service('HttpInterceptorService', HttpInterceptorService);

  function HttpInterceptorService(EnvConfigService) {
    var self = this;

    self.applyTimeout = function (config) {
      var timeoutMs = EnvConfigService.getApiTimeoutMs();
      config.timeout = timeoutMs;
      return config;
    };
  }
})();
