(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('exportService', ['$http', '$q', function($http, $q) {
      var self = this;
      self.generateReport = function(data, format) {
        var deferred = $q.defer();
        if (format === 'PDF') {
          self.generatePDF(data)
            .then(function(blob) {
              self.downloadFile(blob, 'portfolio-report.pdf');
              deferred.resolve();
            })
            .catch(function(error) {
              deferred.reject(error);
            });
        } else if (format === 'EXCEL') {
          self.generateExcel(data)
            .then(function(blob) {
              self.downloadFile(blob, 'portfolio-report.xlsx');
              deferred.resolve();
            })
            .catch(function(error) {
              deferred.reject(error);
            });
        } else {
          deferred.reject('Unsupported format');
        }
        return deferred.promise;
      };
      self.generatePDF = function(data) {
        return $http.post('/api/reports/generate/pdf', data, {
          responseType: 'blob'
        }).then(function(response) {
          return new Blob([response.data], {type: 'application/pdf'});
        });
      };
      self.generateExcel = function(data) {
        return $http.post('/api/reports/generate/excel', data, {
          responseType: 'blob'
        }).then(function(response) {
          return new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        });
      };
      self.downloadFile = function(blob, filename) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      self.exportToCSV = function(data, filename) {
        var csv = self.convertToCSV(data);
        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        self.downloadFile(blob, filename || 'export.csv');
      };
      self.convertToCSV = function(data) {
        if (!data || data.length === 0) return '';
        var headers = Object.keys(data[0]).join(',');
        var rows = data.map(function(row) {
          return Object.values(row).map(function(val) {
            return '"' + (val || '').toString().replace(/"/g, '""') + '"';
          }).join(',');
        });
        return headers + '\n' + rows.join('\n');
      };
    }]);
})();