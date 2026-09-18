(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('ReportService', ['$http', '$q', 'ApiConfigFactory', ReportService]);
  function ReportService($http, $q, ApiConfigFactory) {
    this.exportApplications = function(filters, format) {
      return $http.get(ApiConfigFactory.getEndpoint('/reports/applications'), {
        params: angular.extend({}, filters, { format: format }),
        responseType: 'blob'
      }).then(function(response) {
        return response.data;
      });
    };
    this.getDashboardMetrics = function(filters) {
      return $http.get(ApiConfigFactory.getEndpoint('/reports/dashboard'), { params: filters }).then(function(response) {
        return response.data;
      });
    };
  }
  ReportService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();