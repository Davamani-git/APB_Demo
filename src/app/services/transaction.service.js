angular.module('transactionAnalyticsModule').service('TransactionService', ['$http', '$q', function($http, $q) {
  const API_BASE = '/api';
  this.getTransactions = function(params) {
    return $http.get(API_BASE + '/transactions', { params: params }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.error('Error fetching transactions:', error);
      return $q.reject(error);
    });
  };
  this.getCategories = function() {
    return $http.get(API_BASE + '/categories').then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.error('Error fetching categories:', error);
      return $q.reject(error);
    });
  };
}]);