(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .service('ProfileService', ProfileService);

  ProfileService.$inject = ['$http', '$q', '$timeout', 'ENV_CONFIG'];

  function ProfileService($http, $q, $timeout, ENV_CONFIG) {
    var cachedProfile = null;

    var service = {
      getProfile: getProfile,
      getPreferredDefaultMonth: getPreferredDefaultMonth
    };

    return service;

    function getProfile() {
      if (cachedProfile) {
        return $q.when(cachedProfile);
      }

      if (ENV_CONFIG.useMockApi) {
        var deferred = $q.defer();
        $timeout(function () {
          cachedProfile = {
            customerId: 'anon',
            preferredCurrency: 'USD',
            dashboardPreferences: {
              defaultMonthMode: 'LATEST',
              maxLookbackMonths: ENV_CONFIG.maxLookbackMonths
            },
            consentFlags: {
              analyticsDashboardAllowed: true
            }
          };
          deferred.resolve(cachedProfile);
        }, 200);
        return deferred.promise;
      }

      return $http.get(ENV_CONFIG.apiBaseUrl + '/profile/me', { timeout: ENV_CONFIG.apiTimeoutMs })
        .then(function (response) {
          cachedProfile = response.data || {};
          return cachedProfile;
        });
    }

    function getPreferredDefaultMonth() {
      var deferred = $q.defer();

      getProfile().then(function (profile) {
        var preferences = profile && profile.dashboardPreferences || {};
        var mode = preferences.defaultMonthMode || 'LATEST';
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (mode === 'LATEST') {
          var monthStr = (month < 10 ? '0' + month : '' + month);
          deferred.resolve(year + '-' + monthStr);
        } else {
          var monthStrFallback = (month < 10 ? '0' + month : '' + month);
          deferred.resolve(year + '-' + monthStrFallback);
        }
      }).catch(function () {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var monthStr = (month < 10 ? '0' + month : '' + month);
        deferred.resolve(year + '-' + monthStr);
      });

      return deferred.promise;
    }
  }
})();
