(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('cloudProviderService', ['$http', '$q', 'authService', function($http, $q, authService) {
      var self = this;
      self.validateAndConnect = function(credentials) {
        return $http.post('/api/cloud-providers/connect', credentials)
          .then(function(response) {
            if (response.data.status === 'connected') {
              return self.fetchUsageData(response.data.connectionId);
            }
            return $q.reject('Connection failed');
          });
      };
      self.fetchUsageData = function(connectionId) {
        return $http.get('/api/cloud-providers/' + connectionId + '/usage')
          .then(function(response) {
            return response.data;
          });
      };
      self.getConnections = function(companyId) {
        var params = companyId ? {companyId: companyId} : {};
        return $http.get('/api/cloud-providers/connections', {params: params})
          .then(function(response) {
            return response.data;
          });
      };
      self.testConnection = function(connectionId) {
        return $http.post('/api/cloud-providers/' + connectionId + '/test')
          .then(function(response) {
            return response.data;
          });
      };
      self.deleteConnection = function(connectionId) {
        return $http.delete('/api/cloud-providers/' + connectionId);
      };
      self.syncData = function(connectionId) {
        return $http.post('/api/cloud-providers/' + connectionId + '/sync')
          .then(function(response) {
            return response.data;
          });
      };
      self.getProviderTypes = function() {
        return ['AWS', 'AZURE', 'GCP'];
      };
    }]);
})();