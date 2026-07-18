(function() {
  'use strict';

  KpiComputationService.$inject = ['$filter'];

  function KpiComputationService($filter) {
    var self = this;

    self.buildKpis = buildKpis;

    function buildKpis(summaryModel) {
      if (!summaryModel) {
        return [];
      }
      var currencyFilter = $filter('currencyFormat');

      var totalSpendValue = currencyFilter(summaryModel.totalSpend, summaryModel.currencyCode);
      var transactionCountValue = String(summaryModel.transactionCount);
      var avgValue = currencyFilter(summaryModel.averageTransactionValue, summaryModel.currencyCode);

      var kpis = [
        {
          key: 'totalSpend',
          label: 'Total Spend',
          value: totalSpendValue,
          unit: summaryModel.currencyCode,
          description: 'Aggregated monthly credit card spend',
          emphasis: true
        },
        {
          key: 'transactionCount',
          label: 'Number of Transactions',
          value: transactionCountValue,
          unit: 'transactions',
          description: 'Total number of transactions in the selected month',
          emphasis: false
        },
        {
          key: 'averageTransactionValue',
          label: 'Average Transaction Value',
          value: avgValue,
          unit: summaryModel.currencyCode,
          description: 'Average spend per transaction for the selected month',
          emphasis: false
        }
      ];

      return kpis;
    }
  }

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();
