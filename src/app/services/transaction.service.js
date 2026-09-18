(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionService', ['$q', function($q) {
    var mockTransactions = [
      {id: 1, cardId: 1, date: '2024-01-15', amount: 120.50, category: 'Food & Dining', merchant: 'Restaurant ABC'},
      {id: 2, cardId: 1, date: '2024-01-18', amount: 65.00, category: 'Fuel', merchant: 'Gas Station XYZ'},
      {id: 3, cardId: 2, date: '2024-01-20', amount: 250.00, category: 'Shopping', merchant: 'Mall Store'},
      {id: 4, cardId: 1, date: '2024-02-05', amount: 180.00, category: 'Travel', merchant: 'Airline'},
      {id: 5, cardId: 3, date: '2024-02-10', amount: 95.00, category: 'Entertainment', merchant: 'Cinema'},
      {id: 6, cardId: 2, date: '2024-02-12', amount: 150.00, category: 'Utilities', merchant: 'Electric Co'},
      {id: 7, cardId: 3, date: '2024-02-15', amount: 300.00, category: 'Healthcare', merchant: 'Medical Center'},
      {id: 8, cardId: 1, date: '2024-03-01', amount: 450.00, category: 'Education', merchant: 'Online Course'},
      {id: 9, cardId: 2, date: '2024-03-05', amount: 75.00, category: 'Miscellaneous', merchant: 'General Store'},
      {id: 10, cardId: 3, date: '2024-03-10', amount: 220.00, category: 'Food & Dining', merchant: 'Fine Dining'},
      {id: 11, cardId: 1, date: '2024-03-15', amount: 85.00, category: 'Fuel', merchant: 'Gas Station'},
      {id: 12, cardId: 2, date: '2024-03-20', amount: 320.00, category: 'Shopping', merchant: 'Electronics Store'}
    ];
    return {
      getTransactions: function() {
        return $q.resolve(angular.copy(mockTransactions));
      },
      getTransactionsByCard: function(cardId) {
        var filtered = mockTransactions.filter(function(t) { return t.cardId === cardId; });
        return $q.resolve(angular.copy(filtered));
      },
      getTransactionsByMonth: function(year, month) {
        var filtered = mockTransactions.filter(function(t) {
          var d = new Date(t.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });
        return $q.resolve(angular.copy(filtered));
      }
    };
  }]);
})();