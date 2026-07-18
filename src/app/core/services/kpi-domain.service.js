(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('KpiDomainService', KpiDomainService);

  function KpiDomainService() {
    var self = this;

    // aggregates is expected to be an array of objects { amount: number, count: number }
    self.computeKpis = function(aggregates) {
      var totalSpend = 0;
      var transactionCount = 0;

      if (Array.isArray(aggregates)) {
        aggregates.forEach(function(a) {
          if (a && typeof a.amount === 'number') {
            totalSpend += a.amount;
          }
          if (a && typeof a.count === 'number') {
            transactionCount += a.count;
          }
        });
      }

      var averageTransactionValue = 0;
      if (transactionCount > 0) {
        averageTransactionValue = totalSpend / transactionCount;
      }

      return {
        totalSpend: totalSpend,
        transactionCount: transactionCount,
        averageTransactionValue: averageTransactionValue
      };
    };
  }
})();
