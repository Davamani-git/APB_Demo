(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionService', ['$q', function($q) {
    var mockTransactions = [
      {cardId: 1, date: '2024-01-15', amount: 1200, category: 'Food & Dining', merchant: 'Restaurant A'},
      {cardId: 1, date: '2024-01-18', amount: 3500, category: 'Shopping', merchant: 'Store B'},
      {cardId: 1, date: '2024-01-22', amount: 800, category: 'Fuel', merchant: 'Gas Station C'},
      {cardId: 2, date: '2024-01-10', amount: 5000, category: 'Travel', merchant: 'Airline D'},
      {cardId: 2, date: '2024-01-25', amount: 1500, category: 'Entertainment', merchant: 'Cinema E'},
      {cardId: 3, date: '2024-01-12', amount: 600, category: 'Utilities', merchant: 'Electric Co'},
      {cardId: 1, date: '2024-02-05', amount: 2000, category: 'Healthcare', merchant: 'Clinic F'},
      {cardId: 2, date: '2024-02-08', amount: 1000, category: 'Education', merchant: 'Bookstore G'},
      {cardId: 3, date: '2024-02-14', amount: 400, category: 'Miscellaneous', merchant: 'Shop H'},
      {cardId: 1, date: '2024-02-20', amount: 2500, category: 'Food & Dining', merchant: 'Restaurant I'},
      {cardId: 2, date: '2024-03-03', amount: 1800, category: 'Shopping', merchant: 'Mall J'},
      {cardId: 3, date: '2024-03-10', amount: 900, category: 'Fuel', merchant: 'Gas Station K'}
    ];
    return {
      getAllTransactions: function() {
        return $q.resolve(angular.copy(mockTransactions));
      },
      getTransactionsByCard: function(cardId) {
        var filtered = mockTransactions.filter(function(t) { return t.cardId === parseInt(cardId); });
        return $q.resolve(angular.copy(filtered));
      },
      getCurrentMonthSpend: function() {
        var now = new Date();
        var currentMonth = now.getMonth() + 1;
        var currentYear = now.getFullYear();
        var total = 0;
        mockTransactions.forEach(function(t) {
          var tDate = new Date(t.date);
          if (tDate.getMonth() + 1 === currentMonth && tDate.getFullYear() === currentYear) {
            total += t.amount;
          }
        });
        return $q.resolve(total);
      }
    };
  }]);
})();