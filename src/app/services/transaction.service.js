(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionService', ['$q', function($q) {
    var mockTransactions = {
      1: [
        {id: 101, cardId: 1, amount: 1200, date: '2024-01-15', category: 'Food & Dining', merchant: 'Restaurant ABC'},
        {id: 102, cardId: 1, amount: 3500, date: '2024-01-18', category: 'Shopping', merchant: 'Mall XYZ'},
        {id: 103, cardId: 1, amount: 2000, date: '2024-01-20', category: 'Fuel', merchant: 'Gas Station'},
        {id: 104, cardId: 1, amount: 5300, date: '2024-01-22', category: 'Travel', merchant: 'Airline Booking'}
      ],
      2: [
        {id: 201, cardId: 2, amount: 800, date: '2024-01-16', category: 'Utilities', merchant: 'Electric Bill'},
        {id: 202, cardId: 2, amount: 2200, date: '2024-01-19', category: 'Entertainment', merchant: 'Cinema'},
        {id: 203, cardId: 2, amount: 3500, date: '2024-01-21', category: 'Healthcare', merchant: 'Hospital'}
      ],
      3: [
        {id: 301, cardId: 3, amount: 1500, date: '2024-01-17', category: 'Education', merchant: 'Online Course'},
        {id: 302, cardId: 3, amount: 4000, date: '2024-01-23', category: 'Shopping', merchant: 'Electronics Store'},
        {id: 303, cardId: 3, amount: 4000, date: '2024-01-25', category: 'Miscellaneous', merchant: 'General Store'}
      ]
    };
    return {
      getTransactionsByCard: function(cardId) {
        var transactions = mockTransactions[cardId] || [];
        return $q.resolve(angular.copy(transactions));
      },
      getAllTransactions: function() {
        var allTxns = [];
        for (var key in mockTransactions) {
          allTxns = allTxns.concat(mockTransactions[key]);
        }
        return $q.resolve(angular.copy(allTxns));
      }
    };
  }]);
})();