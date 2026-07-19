(function () {
  'use strict';

  SpendingSummaryMockService.$inject = ['$q', '$timeout'];

  function SpendingSummaryMockService($q, $timeout) {
    var datasetsByMonth = {
      '2026-07': {
        month: '2026-07',
        totalSpend: 1250.75,
        transactionCount: 42,
        averageSpend: 29.78,
        currency: 'USD',
        categories: [
          { name: 'Groceries', amount: 300.00, percentage: 24.0 },
          { name: 'Dining', amount: 250.00, percentage: 20.0 }
        ]
      },
      '2026-06': {
        month: '2026-06',
        totalSpend: 1200.00,
        transactionCount: 40,
        averageSpend: 30.00,
        currency: 'USD',
        categories: [
          { name: 'Travel', amount: 400.00, percentage: 33.3 },
          { name: 'Groceries', amount: 200.00, percentage: 16.7 }
        ]
      },
      '2026-05': {
        month: '2026-05',
        totalSpend: 950.00,
        transactionCount: 28,
        averageSpend: 33.93,
        currency: 'USD',
        categories: [
          { name: 'Utilities', amount: 150.00, percentage: 15.8 },
          { name: 'Dining', amount: 200.00, percentage: 21.1 }
        ]
      },
      '2026-04': {
        month: '2026-04',
        totalSpend: 1100.25,
        transactionCount: 35,
        averageSpend: 31.44,
        currency: 'USD',
        categories: [
          { name: 'Shopping', amount: 350.00, percentage: 31.8 },
          { name: 'Groceries', amount: 250.00, percentage: 22.7 }
        ]
      },
      '2026-03': {
        month: '2026-03',
        totalSpend: 1000.00,
        transactionCount: 32,
        averageSpend: 31.25,
        currency: 'USD',
        categories: [
          { name: 'Dining', amount: 220.00, percentage: 22.0 },
          { name: 'Fuel', amount: 180.00, percentage: 18.0 }
        ]
      },
      '2026-02': {
        month: '2026-02',
        totalSpend: 900.50,
        transactionCount: 30,
        averageSpend: 30.02,
        currency: 'USD',
        categories: [
          { name: 'Groceries', amount: 280.00, percentage: 31.1 },
          { name: 'Entertainment', amount: 150.00, percentage: 16.6 }
        ]
      }
    };

    function getMonthlySummary(month) {
      var deferred = $q.defer();
      $timeout(function () {
        if (datasetsByMonth.hasOwnProperty(month)) {
          deferred.resolve(datasetsByMonth[month]);
        } else {
          deferred.resolve({
            month: month,
            totalSpend: 0,
            transactionCount: 0,
            averageSpend: 0,
            currency: 'USD',
            categories: []
          });
        }
      }, 800);
      return deferred.promise;
    }

    return {
      getMonthlySummary: getMonthlySummary
    };
  }

  angular.module('app')
    .service('spendingSummaryMockService', SpendingSummaryMockService);
})();
