angular.module('transactionAnalyticsModule').service('TransactionService', ['$http', '$q', function($http, $q) {
  const API_BASE = '/api';
  this.getTransactions = function() {
    return $http.get(API_BASE + '/transactions').then(function(response) {
      return response.data;
    }).catch(function(error) {
      return $q.reject(error);
    });
  };
  this.getCategories = function() {
    return $http.get(API_BASE + '/categories').then(function(response) {
      return response.data;
    }).catch(function(error) {
      return $q.reject(error);
    });
  };
}]);