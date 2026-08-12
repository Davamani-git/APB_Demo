angular.module('apbApp').factory('cloudIntegrationFactory', ['$http', '$q', 'configService', function($http, $q, configService) {
  var base = configService.get('apiBaseUrl') + '/integrations';
  return {
    configureIntegration: function(provider, credentials) {
      return $http.post(base + '/' + provider.toLowerCase(), { credentials: credentials }).then(function(res){ return res.data; });
    },
    testConnection: function(provider, credentials) {
      return $http.post(base + '/' + provider.toLowerCase() + '/test', { credentials: credentials }).then(function(res){ return res.data; });
    },
    fetchUsageData: function(provider, companyId) {
      return $http.get(base + '/' + provider.toLowerCase() + '/usage', { params: { companyId: companyId } }).then(function(res){ return res.data; });
    },
    fetchAllProviders: function(companyId) {
      var self = this;
      return $q.all(['AWS', 'Azure', 'GCP'].map(function(p){ return self.fetchUsageData(p, companyId); }));
    }
  };
}]);
