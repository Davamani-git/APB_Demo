(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
      var apiBase = '/api';
      return {
        fetchTransactions: function(cardId, filters) {
          var params = {
            cardId: cardId,
            page: filters.pageNumber || 1,
            size: filters.pageSize || 20
          };
          if (filters.dateRange) {
            params.startDate = filters.dateRange.startDate;
            params.endDate = filters.dateRange.endDate;
          }
          if (filters.minAmount) params.minAmount = filters.minAmount;
          if (filters.maxAmount) params.maxAmount = filters.maxAmount;
          if (filters.merchantName) params.merchant = filters.merchantName;
          return $http.get(apiBase + '/transactions', { params: params })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        fetchAllTransactions: function(dateRange) {
          var params = {};
          if (dateRange) {
            params.startDate = dateRange.startDate;
            params.endDate = dateRange.endDate;
          } else {
            var endDate = new Date();
            var startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 12);
            params.startDate = startDate.toISOString();
            params.endDate = endDate.toISOString();
          }
          return $http.get(apiBase + '/transactions', { params: params })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();