(function() {
  'use strict';
  angular.module('dashboard')
    .service('TransactionService', ['$http', function($http) {
      this.getTransactions = function() {
        return $http.get('/api/transactions')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            throw error;
          });
      };
    }]);
})();