(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .service('TransactionService', ['$http', '$q', function($http, $q) {
      var service = this;
      service.transactions = [];
      service.getTransactions = function() {
        var deferred = $q.defer();
        $http.get('/api/transactions')
          .then(function(response) {
            service.transactions = response.data;
            deferred.resolve(service.transactions);
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
      service.getTransactionsByCard = function(cardId) {
        return service.transactions.filter(function(txn) {
          return txn.cardId === cardId;
        });
      };
      service.getTransactionsByDateRange = function(startDate, endDate) {
        return service.transactions.filter(function(txn) {
          var txnDate = new Date(txn.transactionDate);
          return txnDate >= startDate && txnDate <= endDate;
        });
      };
    }]);
})();