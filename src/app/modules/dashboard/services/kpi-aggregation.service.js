(function() {
  'use strict';
  angular.module('dashboard')
    .service('KpiAggregationService', ['CreditCardDataFactory', 'TransactionFactory', '$q', function(CreditCardDataFactory, TransactionFactory, $q) {
      this.getConsolidatedKpis = function() {
        var promises = {
          cards: CreditCardDataFactory.getAllCards(),
          transactions: TransactionFactory.getCurrentMonthTransactions()
        };
        return $q.all(promises).then(function(results) {
          var cards = results.cards || [];
          var transactions = results.transactions || [];
          var totalCreditLimit = 0;
          var totalAvailableCredit = 0;
          var totalOutstandingAmount = 0;
          var monthlySpend = 0;
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit || 0;
            totalAvailableCredit += card.availableCredit || 0;
            totalOutstandingAmount += card.outstandingAmount || 0;
          });
          transactions.forEach(function(transaction) {
            monthlySpend += transaction.amount || 0;
          });
          return {
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstandingAmount: totalOutstandingAmount,
            monthlySpend: monthlySpend,
            cards: cards
          };
        }).catch(function(error) {
          return $q.reject({
            message: 'Failed to load dashboard data. Please try again.',
            error: error
          });
        });
      };
    }]);
})();