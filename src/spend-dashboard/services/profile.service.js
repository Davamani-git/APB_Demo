(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .service('ProfileService', ProfileService);

  ProfileService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggerService'];

  function ProfileService($http, $q, ENV_CONFIG, LoggerService) {
    var profileCache = null;

    var service = {
      getProfile: getProfile,
      getPreferredDefaultMonth: getPreferredDefaultMonth
    };

    return service;

    function getProfile() {
      if (profileCache) {
        return $q.resolve(profileCache);
      }

      return $http.get(ENV_CONFIG.apiBaseUrl + '/profile/me')
        .then(function (response) {
          profileCache = response.data || {};
          LoggerService.info('Profile loaded');
          return profileCache;
        })
        .catch(function (error) {
          LoggerService.error('Failed to load profile', { error: error });
          return $q.reject(error);
        });
    }

    function getPreferredDefaultMonth() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var monthStr = month < 10 ? '0' + month : '' + month;
      return year + '-' + monthStr;
    }
  }
})();
