(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('ReadinessService', ['$http', '$q', 'ApiConfigFactory', ReadinessService]);
  function ReadinessService($http, $q, ApiConfigFactory) {
    this.evaluateApplication = function(applicationId) {
      return $http.post(ApiConfigFactory.getEndpoint('/readiness/evaluate'), { applicationId: applicationId }).then(function(response) {
        return response.data;
      });
    };
    this.getApplicationStatus = function(applicationId) {
      return $http.get(ApiConfigFactory.getEndpoint('/readiness/status/' + applicationId)).then(function(response) {
        return response.data;
      });
    };
    this.getPayerStatus = function(applicationId, payerId) {
      return $http.get(ApiConfigFactory.getEndpoint('/readiness/status/' + applicationId + '/payer/' + payerId)).then(function(response) {
        return response.data;
      });
    };
    this.getRequirementDetails = function(applicationId, payerId) {
      return $http.get(ApiConfigFactory.getEndpoint('/readiness/requirements/' + applicationId + '/payer/' + payerId)).then(function(response) {
        return response.data;
      });
    };
  }
  ReadinessService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();