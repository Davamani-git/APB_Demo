(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('DocumentService', ['$http', '$q', 'ApiConfigFactory', DocumentService]);
  function DocumentService($http, $q, ApiConfigFactory) {
    this.uploadDocument = function(applicationId, requirementId, file, metadata) {
      var formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      return $http.post(ApiConfigFactory.getEndpoint('/applications/' + applicationId + '/requirements/' + requirementId + '/documents'), formData, {
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).then(function(response) {
        return response.data;
      });
    };
    this.getDocument = function(documentId) {
      return $http.get(ApiConfigFactory.getEndpoint('/documents/' + documentId)).then(function(response) {
        return response.data;
      });
    };
    this.deleteDocument = function(documentId) {
      return $http.delete(ApiConfigFactory.getEndpoint('/documents/' + documentId)).then(function(response) {
        return response.data;
      });
    };
    this.validateExpiration = function(expirationDate) {
      var expDate = new Date(expirationDate);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return expDate >= today;
    };
  }
  DocumentService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();