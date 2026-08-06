(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .service('cloudDataService', ['$http', '$q', function($http, $q) {
      this.fetchAllUsageData = function() {
        var awsPromise = $http.get('/api/aws/usage');
        var azurePromise = $http.get('/api/azure/usage');
        var gcpPromise = $http.get('/api/gcp/usage');
        return $q.all([awsPromise, azurePromise, gcpPromise]).then(function(responses) {
          var combinedData = [];
          responses.forEach(function(response) {
            if (response.data && Array.isArray(response.data)) {
              combinedData = combinedData.concat(response.data);
            }
          });
          return combinedData;
        });
      };
      this.fetchProviderData = function(provider) {
        return $http.get('/api/' + provider.toLowerCase() + '/usage').then(function(response) {
          return response.data;
        });
      };
    }]);
})();