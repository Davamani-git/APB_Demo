(function() {
  'use strict';

  function KpiComputationService($filter) {
    var service = {
      buildKpis: buildKpis
    };

    return service;

    function buildKpis(summaryModel) {
      if (!summaryModel) {
        return [];
      }

      var numberFilter = $filter('number');
      var currencyFilter = $filter('currencyFormat');

      var kpis = [];

      var totalSpendLabel = 'Total Spend';
      var totalSpendValue = currencyFilter(summaryModel.totalSpend, summaryModel.currencyCode);
      kpis.push({
        key: 'totalSpend',
        label: totalSpendLabel,
        value: totalSpendValue,
        unit: summaryModel.currencyCode
      });

      var transactionCountLabel = 'Number of Transactions';
      var transactionCountValue = numberFilter(summaryModel.transactionCount, 0);
      kpis.push({
        key: 'transactionCount',
        label: transactionCountLabel,
        value: transactionCountValue,
        unit: ''
      });

      var averageLabel = 'Average Transaction Value';
      var averageValue = currencyFilter(summaryModel.averageTransactionValue, summaryModel.currencyCode);
      kpis.push({
        key: 'averageTransactionValue',
        label: averageLabel,
        value: averageValue,
        unit: summaryModel.currencyCode
      });

      if (summaryModel.dataFreshness && summaryModel.dataFreshness.asOfDate) {
        var freshnessLabel = 'Data as of';
        var freshnessValue = summaryModel.dataFreshness.asOfDate;
        kpis.push({
          key: 'dataFreshness',
          label: freshnessLabel,
          value: freshnessValue,
          unit: ''
        });
      }

      return kpis;
    }
  }

  KpiComputationService.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();
