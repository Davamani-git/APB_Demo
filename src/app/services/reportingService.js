angular.module('apbApp').service('reportingService', ['$http', 'configService', function($http, configService) {
  var base = configService.get('apiBaseUrl') + '/reports';
  this.generateReport = function(companyId, reportType, params) {
    return $http.post(base + '/generate', { companyId: companyId, reportType: reportType, params: params || {} }).then(function(res){ return res.data; });
  };
  this.exportReport = function(reportId, format) {
    return $http.get(base + '/' + reportId + '/export', { params: { format: format || 'pdf' }, responseType: 'blob' }).then(function(res){ return res.data; });
  };
}]);
