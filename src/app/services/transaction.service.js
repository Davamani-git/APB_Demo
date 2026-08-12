(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', function($http, $q) {
      var self = this;
      var cursor = null;
      self.getTransactions = function(filters, pagination) {
        var params = {
          page: pagination.currentPage || 1,
          size: pagination.pageSize || 50
        };
        if (filters.cardId) params.cardId = filters.cardId;
        if (filters.category) params.category = filters.category;
        if (filters.dateRange && filters.dateRange.start) params.startDate = filters.dateRange.start.toISOString();
        if (filters.dateRange && filters.dateRange.end) params.endDate = filters.dateRange.end.toISOString();
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortOrder) params.sortOrder = filters.sortOrder;
        return $http.get('/api/transactions', { params: params }).then(function(response) {
          cursor = response.data.cursor || null;
          return {
            transactions: response.data.transactions || response.data,
            total: response.data.total || 0
          };
        }).catch(function(error) {
          console.error('Error fetching transactions:', error);
          return $q.reject(error);
        });
      };
      self.getCursor = function() {
        return cursor;
      };
    }]);
})();