(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('OcrService', ['$http', '$q', 'ApiConfigFactory', OcrService]);
  function OcrService($http, $q, ApiConfigFactory) {
    this.extractExpirationDate = function(file) {
      var formData = new FormData();
      formData.append('file', file);
      return $http.post(ApiConfigFactory.getEndpoint('/ocr/extract-expiration'), formData, {
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).then(function(response) {
        return response.data;
      });
    };
  }
  OcrService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();