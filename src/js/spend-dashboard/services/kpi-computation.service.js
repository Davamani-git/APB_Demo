(function() {
  'use strict';

  KpiComputationService.$inject = ['$filter'];

  function KpiComputationService($filter) {
    var service = this;
    var currencyFilter = $filter('currencyFormat');

    service.buildKpis = function(summaryModel) {
      if (!summaryModel) {
        return [];
      }

      var kpis = [
        {
          label: 'Total Spend',
          value: currencyFilter(summaryModel.totalSpend),
          unit: summaryModel.currencyCode,
          rawValue: summaryModel.totalSpend
        },
        {
          label: 'Number of Transactions',
          value: summaryModel.transactionCount,
          unit: 'transactions',
          rawValue: summaryModel.transactionCount
        },
        {
          label: 'Average Transaction',
          value: currencyFilter(summaryModel.averageTransactionValue),
          unit: summaryModel.currencyCode,
          rawValue: summaryModel.averageTransactionValue
        }
      ];

      return kpis;
    };

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();