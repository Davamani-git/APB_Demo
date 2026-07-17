(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .service('ConfigService', ConfigService);

  ConfigService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggerService'];

  function ConfigService($http, $q, ENV_CONFIG, LoggerService) {
    var configCache = null;

    var service = {
      load: load,
      getMaxLookbackMonths: getMaxLookbackMonths,
      getFreshnessThresholdMinutes: getFreshnessThresholdMinutes,
      isBreakdownEnabled: isBreakdownEnabled
    };

    return service;

    function load() {
      if (configCache) {
        return $q.resolve(configCache);
      }

      return $http.get(ENV_CONFIG.apiBaseUrl + '/config/dashboard-monthly-spend')
        .then(function (response) {
          configCache = response.data || {};
          LoggerService.info('Dashboard config loaded');
          return configCache;
        })
        .catch(function (error) {
          LoggerService.error('Failed to load dashboard config', { error: error });
          configCache = configCache || {};
          return configCache;
        });
    }

    function getMaxLookbackMonths() {
      if (configCache && angular.isNumber(configCache.maxLookbackMonths)) {
        return configCache.maxLookbackMonths;
      }
      return ENV_CONFIG.maxLookbackMonths;
    }

    function getFreshnessThresholdMinutes() {
      if (configCache && angular.isNumber(configCache.freshnessThresholdMinutes)) {
        return configCache.freshnessThresholdMinutes;
      }
      return 60;
    }

    function isBreakdownEnabled() {
      if (!configCache) {
        return true;
      }
      if (angular.isDefined(configCache.enableBreakdownWidget)) {
        return !!configCache.enableBreakdownWidget;
      }
      return true;
    }
  }
})();
