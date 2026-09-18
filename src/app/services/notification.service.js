(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('NotificationService', ['$http', '$q', 'ApiConfigFactory', NotificationService]);
  function NotificationService($http, $q, ApiConfigFactory) {
    this.getExpiringDocuments = function(thresholdDays) {
      return $http.get(ApiConfigFactory.getEndpoint('/notifications/expiring'), { params: { thresholdDays: thresholdDays } }).then(function(response) {
        return response.data;
      });
    };
    this.sendExpirationAlert = function(applicationId, documentId) {
      return $http.post(ApiConfigFactory.getEndpoint('/notifications/expiration-alert'), { applicationId: applicationId, documentId: documentId }).then(function(response) {
        return response.data;
      });
    };
  }
  NotificationService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();