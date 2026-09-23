(function() {
  'use strict';
  angular.module('creditDashboardApp').service('TransactionService', ['$http', '$q', 'ApiConfigFactory', function($http, $q, ApiConfigFactory) {
    var mockTransactions = [
      {id: 'T001', cardId: 'C001', txnDate: '2025-02-01', amount: 1200, currency: 'INR', category: 'Food & Dining', merchant: 'Restaurant A'},
      {id: 'T002', cardId: 'C001', txnDate: '2025-02-03', amount: 800, currency: 'INR', category: 'Fuel', merchant: 'Petrol Pump B'},
      {id: 'T003', cardId: 'C001', txnDate: '2025-02-05', amount: 3500, currency: 'INR', category: 'Shopping', merchant: 'Mall C'},
      {id: 'T004', cardId: 'C002', txnDate: '2025-02-02', amount: 2500, currency: 'INR', category: 'Travel', merchant: 'Airline D'},
      {id: 'T005', cardId: 'C002', txnDate: '2025-02-07', amount: 1500, currency: 'INR', category: 'Entertainment', merchant: 'Cinema E'},
      {id: 'T006', cardId: 'C003', txnDate: '2025-02-04', amount: 900, currency: 'INR', category: 'Utilities', merchant: 'Electric Bill'},
      {id: 'T007', cardId: 'C003', txnDate: '2025-02-08', amount: 2000, currency: 'INR', category: 'Healthcare', merchant: 'Hospital F'},
      {id: 'T008', cardId: 'C001', txnDate: '2025-01-15', amount: 1100, currency: 'INR', category: 'Food & Dining', merchant: 'Restaurant G'},
      {id: 'T009', cardId: 'C002', txnDate: '2025-01-20', amount: 3000, currency: 'INR', category: 'Shopping', merchant: 'Store H'},
      {id: 'T010', cardId: 'C003', txnDate: '2025-01-25', amount: 1800, currency: 'INR', category: 'Education', merchant: 'Course I'}
    ];
    this.getTransactions = function(userId, cardId, month) {
      var deferred = $q.defer();
      var filtered = angular.copy(mockTransactions);
      if (cardId) {
        filtered = filtered.filter(function(t) { return t.cardId === cardId; });
      }
      if (month) {
        filtered = filtered.filter(function(t) { return t.txnDate.startsWith(month); });
      }
      setTimeout(function() {
        deferred.resolve(filtered);
      }, 200);
      return deferred.promise;
    };
  }]);
  angular.module('creditDashboardApp').service('TransactionService').$inject = ['$http', '$q', 'ApiConfigFactory'];
})();