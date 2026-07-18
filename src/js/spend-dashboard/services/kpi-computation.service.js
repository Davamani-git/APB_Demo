(function() {
  'use strict';

  KpiComputationService.$inject = ['$filter'];

  function KpiComputationService($filter) {
    var numberFilter = $filter('number');

    this.buildKpis = function(summaryModel) {
      if (!summaryModel) {
        return [];
      }

      var currencyCode = summaryModel.currencyCode || '';

      var kpis = [
        {
          key: 'totalSpend',
          label: 'Total Spend',
          value: numberFilter(summaryModel.totalSpend, 2),
          unit: currencyCode
        },
        {
          key: 'transactionCount',
          label: 'Number of Transactions',
          value: summaryModel.transactionCount,
          unit: ''
        }
      ];

      if (summaryModel.transactionCount > 0) {
        kpis.push({
          key: 'averageTransactionValue',
          label: 'Average Transaction Value',
          value: numberFilter(summaryModel.averageTransactionValue, 2),
          unit: currencyCode
        });
      }

      return kpis;
    };
  }

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();
