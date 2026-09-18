(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('ApplicationService', ['$http', '$q', 'ApiConfigFactory', ApplicationService]);
  function ApplicationService($http, $q, ApiConfigFactory) {
    this.getApplications = function(filters) {
      return $http.get(ApiConfigFactory.getEndpoint('/applications'), { params: filters }).then(function(response) {
        return response.data;
      });
    };
    this.getApplication = function(applicationId) {
      return $http.get(ApiConfigFactory.getEndpoint('/applications/' + applicationId)).then(function(response) {
        return response.data;
      });
    };
    this.createApplication = function(application) {
      return $http.post(ApiConfigFactory.getEndpoint('/applications'), application).then(function(response) {
        return response.data;
      });
    };
    this.updateApplication = function(applicationId, application) {
      return $http.put(ApiConfigFactory.getEndpoint('/applications/' + applicationId), application).then(function(response) {
        return response.data;
      });
    };
  }
  ApplicationService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();