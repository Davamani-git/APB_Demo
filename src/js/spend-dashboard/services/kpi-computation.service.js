(function() {
  'use strict';

  KpiComputationService.$inject = ['$filter'];

  function KpiComputationService($filter) {
    var numberFilter = $filter('number');
    var currencyFilter = $filter('currencyFormat');

    this.buildKpis = function(summaryModel) {
      if (!summaryModel) {
        return [];
      }

      var kpis = [];

      // Total spend KPI
      var totalSpendLabel = 'Total spend';
      var totalSpendValue = currencyFilter(summaryModel.totalSpend, summaryModel.currencyCode);
      kpis.push({
        key: 'totalSpend',
        label: totalSpendLabel,
        value: totalSpendValue,
        unit: summaryModel.currencyCode,
        rawValue: summaryModel.totalSpend
      });

      // Number of transactions KPI
      var txnLabel = 'Number of transactions';
      var txnValue = numberFilter(summaryModel.transactionCount, 0);
      kpis.push({
        key: 'transactionCount',
        label: txnLabel,
        value: txnValue,
        unit: 'transactions',
        rawValue: summaryModel.transactionCount
      });

      // Average transaction value KPI
      var avgLabel = 'Average transaction value';
      var avgValue = currencyFilter(summaryModel.averageTransactionValue, summaryModel.currencyCode);
      kpis.push({
        key: 'averageTransactionValue',
        label: avgLabel,
        value: avgValue,
        unit: summaryModel.currencyCode,
        rawValue: summaryModel.averageTransactionValue
      });

      return kpis;
    };
  }

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();
