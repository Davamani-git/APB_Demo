angular.module('apbApp').service('dataStorageService', ['$http', 'dataNormalizationService', 'configService', function($http, dataNormalizationService, configService) {
  var base = configService.get('apiBaseUrl') + '/data';
  this.persist = function(companyId) {
    return dataNormalizationService.normalizeAll(companyId).then(function(records) {
      return $http.post(base + '/store', { companyId: companyId, records: records }).then(function(res){ return res.data; });
    });
  };
  this.getStoredData = function(companyId) {
    return $http.get(base + '/store', { params: { companyId: companyId } }).then(function(res){ return res.data; });
  };
  this.getFreshness = function() {
    return $http.get(base + '/freshness').then(function(res){ return res.data; });
  };
}]);
