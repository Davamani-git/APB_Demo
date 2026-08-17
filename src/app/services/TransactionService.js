(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionService', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT) {
      var TransactionService = function() {};
      TransactionService.prototype.fetchTransactions = function() {
        return $http.get(API_ENDPOINT + '/transactions')
          .then(function(response) {
            return response.data.map(function(txn) {
              txn.transactionDate = new Date(txn.transactionDate);
              return txn;
            });
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
      return new TransactionService();
    }]);
})();