(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('AuditService', ['$http', '$q', 'ApiConfigFactory', AuditService]);
  function AuditService($http, $q, ApiConfigFactory) {
    this.getAuditTrail = function(applicationId) {
      return $http.get(ApiConfigFactory.getEndpoint('/audit/application/' + applicationId)).then(function(response) {
        return response.data;
      });
    };
    this.logEvent = function(event) {
      return $http.post(ApiConfigFactory.getEndpoint('/audit/log'), event).then(function(response) {
        return response.data;
      });
    };
  }
  AuditService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();