(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .service('ConfigService', ConfigService);

  ConfigService.$inject = ['$http', '$q', '$timeout', 'ENV_CONFIG'];

  function ConfigService($http, $q, $timeout, ENV_CONFIG) {
    var loaded = false;
    var config = {
      maxLookbackMonths: ENV_CONFIG.maxLookbackMonths,
      freshnessThresholdMinutes: 60,
      enableBreakdownWidget: true
    };

    var service = {
      load: load,
      getMaxLookbackMonths: getMaxLookbackMonths,
      getFreshnessThresholdMinutes: getFreshnessThresholdMinutes,
      isBreakdownEnabled: isBreakdownEnabled
    };

    return service;

    function load() {
      if (loaded) {
        return $q.when();
      }

      if (ENV_CONFIG.useMockApi) {
        var deferred = $q.defer();
        $timeout(function () {
          loaded = true;
          deferred.resolve();
        }, 200);
        return deferred.promise;
      }

      return $http.get(ENV_CONFIG.apiBaseUrl + '/config/dashboard-monthly-spend', { timeout: ENV_CONFIG.apiTimeoutMs })
        .then(function (response) {
          var data = response.data || {};
          config.maxLookbackMonths = data.maxLookbackMonths || config.maxLookbackMonths;
          config.freshnessThresholdMinutes = data.freshnessThresholdMinutes || config.freshnessThresholdMinutes;
          config.enableBreakdownWidget = typeof data.enableBreakdownWidget === 'boolean' ? data.enableBreakdownWidget : config.enableBreakdownWidget;
          loaded = true;
        });
    }

    function getMaxLookbackMonths() {
      return config.maxLookbackMonths;
    }

    function getFreshnessThresholdMinutes() {
      return config.freshnessThresholdMinutes;
    }

    function isBreakdownEnabled() {
      return config.enableBreakdownWidget;
    }
  }
})();
