(function () {
  'use strict';

  SpendSummaryMockService.$inject = ['$q', '$timeout'];

  angular.module('app')
    .service('SpendSummaryMockService', SpendSummaryMockService);

  function SpendSummaryMockService($q, $timeout) {
    var self = this;

    self.getMonthlySummary = function (month) {
      var deferred = $q.defer();
      var delayMs = 500; // Simulated latency

      $timeout(function () {
        if (month === '9999-99') {
          // Simulated failure scenario
          deferred.reject({
            data: {
              code: 'MOCK_ERROR',
              message: 'Simulated mock error for testing.',
              httpStatus: 500,
              correlationId: 'mock-error-9999'
            },
            status: 500
          });
          return;
        }

        var response = {
          month: month,
          customerId: 'MOCK-CUST',
          cardSummaries: [
            {
              cardId: 'CARD-MOCK-1',
              cardDisplayName: 'Mock Platinum Card',
              totalAmount: 1234.56,
              transactionCount: 40,
              averageTransactionAmount: 30.86,
              breakdown: [
                {
                  segmentCode: 'NEC',
                  segmentLabel: 'Necessities',
                  amount: 600,
                  transactionCount: 18,
                  percentageOfTotal: 48.6
                },
                {
                  segmentCode: 'DISC',
                  segmentLabel: 'Discretionary',
                  amount: 634.56,
                  transactionCount: 22,
                  percentageOfTotal: 51.4
                }
              ]
            }
          ],
          consolidatedTotals: {
            totalAmount: 1234.56,
            transactionCount: 40,
            averageTransactionAmount: 30.86
          },
          breakdown: [
            {
              segmentCode: 'NEC',
              segmentLabel: 'Necessities',
              amount: 600,
              transactionCount: 18,
              percentageOfTotal: 48.6
            },
            {
              segmentCode: 'DISC',
              segmentLabel: 'Discretionary',
              amount: 634.56,
              transactionCount: 22,
              percentageOfTotal: 51.4
            }
          ],
          metadata: {
            currencyCode: 'USD',
            lastUpdatedUtc: new Date().toISOString()
          }
        };

        deferred.resolve(response);
      }, delayMs);

      return deferred.promise;
    };
  }
})();
