(function() {
  'use strict';
  angular.module('dashboardModule').service('cloudIntegrationService', ['$http', 'authService', function($http, authService) {
    var self = this;
    var API_BASE = '/api/cloud';
    function getHeaders() {
      return {
        'Authorization': 'Bearer ' + authService.getToken(),
        'Content-Type': 'application/json'
      };
    }
    self.fetchAWSData = function(companyId) {
      return $http.get(API_BASE + '/aws/ai-usage', {
        params: { companyId: companyId },
        headers: getHeaders()
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        throw error;
      });
    };
    self.fetchAzureData = function(companyId) {
      return $http.get(API_BASE + '/azure/ai-usage', {
        params: { companyId: companyId },
        headers: getHeaders()
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        throw error;
      });
    };
    self.fetchGCPData = function(companyId) {
      return $http.get(API_BASE + '/gcp/ai-usage', {
        params: { companyId: companyId },
        headers: getHeaders()
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        throw error;
      });
    };
  }]);
})();