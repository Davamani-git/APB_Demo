(function() {
  'use strict';
  angular.module('app.transactions')
    .service('TransactionService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      this.getTransactions = function(filters) {
        var params = filters || {};
        return $http.get(API_CONFIG.baseUrl + '/transactions', {params: params})
          .then(function(response) {
            return response.data;
          });
      };
      this.searchTransactions = function(query) {
        return $http.get(API_CONFIG.baseUrl + '/transactions/search', {params: {q: query}})
          .then(function(response) {
            return response.data;
          });
      };
      this.exportTransactions = function(format) {
        return $http.get(API_CONFIG.baseUrl + '/transactions/export', {
          params: {format: format},
          responseType: 'blob'
        }).then(function(response) {
          var blob = new Blob([response.data], {type: response.headers('content-type')});
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'transactions.' + format;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      };
    }]);
})();