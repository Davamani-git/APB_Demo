(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .factory('TransactionFactory', ['$http', '$q', function($http, $q) {
      var apiBase = '/api/transactions';
      var cachedTransactions = null;
      return {
        getCurrentMonthTransactions: function() {
          return $http.get(apiBase + '?month=current')
            .then(function(response) {
              cachedTransactions = response.data;
              return response.data;
            })
            .catch(function(error) {
              if (cachedTransactions) {
                return cachedTransactions;
              }
              return $q.reject(error);
            });
        },
        getTransactionsByCardId: function(cardId) {
          return $http.get(apiBase + '?cardId=' + cardId)
            .then(function(response) {
              return response.data;
            });
        }
      };
    }]);
})();