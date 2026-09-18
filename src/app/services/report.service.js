(function() {
  'use strict';
  angular.module('dashboardModule').service('reportService', ['$http', 'dataAggregationFactory', function($http, dataAggregationFactory) {
    var self = this;
    var API_BASE = '/api/reports';
    self.generatePDFReport = function(portfolioData) {
      return $http.post(API_BASE + '/pdf', portfolioData, {
        responseType: 'blob'
      }).then(function(response) {
        self.downloadFile(response.data, 'portfolio-report.pdf', 'application/pdf');
        return response.data;
      }).catch(function(error) {
        throw error;
      });
    };
    self.generateExcelReport = function(portfolioData) {
      return $http.post(API_BASE + '/excel', portfolioData, {
        responseType: 'blob'
      }).then(function(response) {
        self.downloadFile(response.data, 'portfolio-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return response.data;
      }).catch(function(error) {
        throw error;
      });
    };
    self.downloadFile = function(data, filename, mimeType) {
      var blob = new Blob([data], { type: mimeType });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };
  }]);
})();