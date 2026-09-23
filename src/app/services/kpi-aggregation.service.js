(function() {
  'use strict';
  angular.module('creditDashboardApp').service('KpiAggregationService', ['CardService', 'TransactionService', '$q', function(CardService, TransactionService, $q) {
    this.aggregateKpis = function(userId, month) {
      var deferred = $q.defer();
      var kpiSummary = {
        month: month,
        totalMonthlySpend: 0,
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstandingAmount: 0,
        cardCount: 0
      };
      $q.all([
        CardService.getCards(userId),
        TransactionService.getTransactions(userId, null, month)
      ]).then(function(results) {
        var cards = results[0];
        var transactions = results[1];
        kpiSummary.cardCount = cards.length;
        cards.forEach(function(card) {
          kpiSummary.totalCreditLimit += card.creditLimit;
          kpiSummary.totalAvailableCredit += card.availableCredit;
          kpiSummary.totalOutstandingAmount += card.outstandingAmount;
        });
        transactions.forEach(function(txn) {
          kpiSummary.totalMonthlySpend += txn.amount;
        });
        deferred.resolve(kpiSummary);
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
  }]);
  angular.module('creditDashboardApp').service('KpiAggregationService').$inject = ['CardService', 'TransactionService', '$q'];
})();