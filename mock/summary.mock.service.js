(function() {
  'use strict';

  SummaryMockService.$inject = ['$q', '$timeout', 'ENV_CONFIG', 'MonthlySummaryModel', 'ErrorModel', 'LoggingService'];

  function SummaryMockService($q, $timeout, ENV_CONFIG, MonthlySummaryModel, ErrorModel, LoggingService) {
    this.getMonthlySummary = function(month) {
      var deferred = $q.defer();

      $timeout(function() {
        if (ENV_CONFIG.featureFlags && ENV_CONFIG.featureFlags.simulateSummaryError) {
          LoggingService.error('Simulated summary error in mock service');
          deferred.reject(new ErrorModel({
            code: '500',
            message: 'Simulated error while loading spending summary.'
          }));
          return;
        }

        if (!/^\d{4}-\d{2}$/.test(month)) {
          deferred.reject(new ErrorModel({
            code: '400',
            message: 'Invalid month selected. Please choose a valid month.'
          }));
          return;
        }

        var data = null;
        if (window.MonthlySummaryMockData && window.MonthlySummaryMockData[month]) {
          data = window.MonthlySummaryMockData[month];
        } else {
          data = {
            month: month,
            totalSpend: 0,
            transactionCount: 0,
            averageSpend: 0,
            currency: 'INR',
            kpiMetrics: {},
            chartData: {
              labels: [],
              datasets: [{ label: 'Spend by Category', data: [], backgroundColor: [] }]
            },
            chartOptions: {
              responsive: true,
              legend: { position: 'bottom' },
              tooltips: { enabled: true }
            }
          };
        }

        deferred.resolve(new MonthlySummaryModel(data));
      }, 500);

      return deferred.promise;
    };
  }

  angular.module('app')
    .service('SummaryMockService', SummaryMockService);
})();
