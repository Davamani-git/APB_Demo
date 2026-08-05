(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .service('UserProfileApiService', UserProfileApiService);

  UserProfileApiService.$inject = ['$http', 'ConfigService', 'LoggingService', '$q'];
  function UserProfileApiService($http, ConfigService, LoggingService, $q) {
    this.getUserProfile = function () {
      var url = ConfigService.apiBaseUrl + '/api/user-profile';
      var correlationId = LoggingService.newCorrelationId();

      return $http.get(url, {
        headers: { 'X-Correlation-Id': correlationId }
      }).then(function (res) {
        return res.data;
      }).catch(function (err) {
        LoggingService.error('UserProfileApiService.getUserProfile', { error: err, correlationId: correlationId });
        return $q.reject(err);
      });
    };
  }
})();
