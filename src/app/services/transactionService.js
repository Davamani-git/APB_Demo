(function() {
  'use strict';
  angular.module('creditCardApp').factory('transactionService', ['$http', '$q', function($http, $q) {
    const baseUrl = '/api/transactions';
    return {
      getTransactions: function(page, size, cardId) {
        const params = {
          page: page || 1,
          size: size || 50
        };
        if (cardId) {
          params.cardId = cardId;
        }
        return $http.get(baseUrl, { params: params })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject('Failed to fetch transactions. Please try again later.');
          });
      },
      getTransactionById: function(id) {
        return $http.get(baseUrl + '/' + id)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject('Failed to fetch transaction details.');
          });
      }
    };
  }]);
})();