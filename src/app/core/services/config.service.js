(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .service('ConfigService', ConfigService);

  ConfigService.$inject = ['$http'];
  function ConfigService($http) {
    var service = this;
    service.apiBaseUrl = '';

    service.load = function (env) {
      var file = 'config/env.' + env + '.json';
      return $http.get(file).then(function (response) {
        service.apiBaseUrl = response.data.apiBaseUrl;
        service.featureFlags = response.data.featureFlags || {};
        service.logLevel = response.data.logLevel || 'INFO';
        return response.data;
      });
    };
  }
})();
