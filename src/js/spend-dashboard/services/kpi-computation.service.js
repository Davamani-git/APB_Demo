(function() {
  'use strict';

  function KpiComputationService($filter) {
    function buildKpis(summaryModel) {
      if (!summaryModel) {
        return [];
      }

      var kpis = [];
      
      // Total Spend KPI
      kpis.push({
        label: 'Total Spend',
        value: $filter('currencyFormat')(summaryModel.totalSpend),
        unit: summaryModel.currencyCode,
        icon: 'glyphicon-credit-card',
        color: '#007bff'
      });
      
      // Transaction Count KPI
      kpis.push({
        label: 'Transactions',
        value: summaryModel.transactionCount.toString(),
        unit: 'transactions',
        icon: 'glyphicon-list-alt',
        color: '#28a745'
      });
      
      // Average Transaction Value KPI
      if (summaryModel.transactionCount > 0) {
        kpis.push({
          label: 'Average Transaction',
          value: $filter('currencyFormat')(summaryModel.averageTransactionValue),
          unit: 'per transaction',
          icon: 'glyphicon-stats',
          color: '#ffc107'
        });
      }
      
      // Data Freshness KPI (if enabled)
      if (summaryModel.dataFreshness && summaryModel.dataFreshness.asOfDate) {
        kpis.push({
          label: 'Data As Of',
          value: $filter('date')(summaryModel.dataFreshness.asOfDate, 'MMM d, yyyy'),
          unit: summaryModel.dataFreshness.isApproximate ? '(approximate)' : '(final)',
          icon: 'glyphicon-time',
          color: '#6c757d'
        });
      }
      
      return kpis;
    }

    return {
      buildKpis: buildKpis
    };
  }

  KpiComputationService.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .service('KpiComputationService', KpiComputationService);
})();