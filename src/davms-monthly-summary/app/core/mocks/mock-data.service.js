(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('MockDataService', MockDataService);

  MockDataService.$inject = ['$q', '$timeout'];

  function MockDataService($q, $timeout) {
    this.getMonthlySummary = function(accountId, month) {
      var deferred = $q.defer();
      $timeout(function() {
        var response = {
          accountId: accountId,
          month: month,
          aggregates: [
            { amount: 345.67, count: 10 },
            { amount: 200.00, count: 5 },
            { amount: 500.00, count: 20 },
            { amount: 188.89, count: 10 }
          ],
          breakdownEntries: [
            { categoryCode: 'GROCERY', categoryLabel: 'Groceries', amount: 345.67 },
            { categoryCode: 'ONLINE', categoryLabel: 'Online Shopping', amount: 200.00 },
            { categoryCode: 'DINING', categoryLabel: 'Dining', amount: 500.00 },
            { categoryCode: 'OTHER', categoryLabel: 'Other', amount: 188.89 }
          ]
        };
        deferred.resolve({ data: response });
      }, 500);
      return deferred.promise;
    };

    this.getAvailableMonths = function(accountId) {
      var deferred = $q.defer();
      $timeout(function() {
        var response = [
          { value: '2024-06', label: 'Jun 2024' },
          { value: '2024-05', label: 'May 2024' },
          { value: '2024-04', label: 'Apr 2024' }
        ];
        deferred.resolve({ data: response });
      }, 300);
      return deferred.promise;
    };
  }
})();
