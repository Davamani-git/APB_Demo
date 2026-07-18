(function () {
  'use strict';

  KpiComputationService.$inject = ['$filter'];

  function KpiComputationService($filter) {
    var self = this;

    self.buildKpis = function (summaryModel) {
      if (!summaryModel) {
        return [];
      }

      var currencyFormatter = $filter('currencyFormat');

      var totalSpendValue = currencyFormatter(summaryModel.totalSpend, summaryModel.currencyCode);
      var averageValue = currencyFormatter(summaryModel.averageTransactionValue, summaryModel.currencyCode);

      var kpis = [
        {
          key: 'totalSpend',
          label: 'Total Spend',
          value: totalSpendValue,
          unit: summaryModel.currencyCode,
          icon: 'glyphicon-stats'
        },
        {
          key: 'transactionCount',
          label: 'Number of Transactions',
          value: summaryModel.transactionCount,
          unit: 'transactions',
          icon: 'glyphicon-list-alt'
        }
      ];

      if (summaryModel.transactionCount > 0) {
        kpis.push({
          key: 'averageTransactionValue',
          label: 'Average Transaction Value',
          value: averageValue,
          unit: summaryModel.currencyCode,
          icon: 'glyphicon-scale'
        });
      }

      return kpis;
    };
  }

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();
