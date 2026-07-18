(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('SummaryMockService', SummaryMockService);

  SummaryMockService.$inject = ['$q', '$timeout', 'ERROR_CODES', 'ErrorModel', 'MonthlySummaryModel', 'BreakdownItemModel', 'EnvConfigService'];

  function SummaryMockService($q, $timeout, ERROR_CODES, ErrorModel, MonthlySummaryModel, BreakdownItemModel, EnvConfigService) {
    var self = this;

    self.getMonthlySummary = function(accountId, month) {
      var deferred = $q.defer();

      EnvConfigService.loadEnvConfig().then(function(env) {
        var delay = 500;

        $timeout(function() {
          if (!month || !/^\d{4}-\d{2}$/.test(month)) {
            deferred.reject(new ErrorModel({
              code: ERROR_CODES.VALIDATION_ERROR,
              httpStatus: null,
              message: 'Invalid month format.',
              retryable: false
            }));
            return;
          }

          var now = new Date();
          var year = parseInt(month.substring(0, 4), 10);
          var monthIndex = parseInt(month.substring(5, 7), 10) - 1;
          var fromDate = new Date(year, monthIndex, 1);

          if (fromDate > now) {
            deferred.reject(new ErrorModel({
              code: ERROR_CODES.VALIDATION_ERROR,
              httpStatus: null,
              message: 'Selected month is in the future.',
              retryable: false
            }));
            return;
          }

          var maxLookbackMonths = env.maxLookbackMonths || 24;
          var monthsDiff = (now.getFullYear() - fromDate.getFullYear()) * 12 + (now.getMonth() - fromDate.getMonth());
          if (monthsDiff > maxLookbackMonths) {
            deferred.reject(new ErrorModel({
              code: ERROR_CODES.VALIDATION_ERROR,
              httpStatus: null,
              message: 'Data is not available for the selected month.',
              retryable: false
            }));
            return;
          }

          var hasData = true;
          var responseJson;

          if (hasData) {
            responseJson = {
              accountId: accountId || 'MOCK-1234',
              month: month,
              totalSpend: 1000.0,
              transactionCount: 20,
              averageTransactionValue: 50.0,
              currencyCode: 'USD',
              breakdown: [
                {
                  categoryCode: 'ONLINE',
                  categoryLabel: 'Online Purchases',
                  amount: 400.0,
                  percentage: 40.0
                },
                {
                  categoryCode: 'IN_STORE',
                  categoryLabel: 'In-Store Purchases',
                  amount: 600.0,
                  percentage: 60.0
                }
              ],
              dataFreshness: new Date().toISOString(),
              source: 'MOCK'
            };
          } else {
            responseJson = {
              accountId: accountId || 'MOCK-1234',
              month: month,
              totalSpend: 0,
              transactionCount: 0,
              averageTransactionValue: 0,
              currencyCode: 'USD',
              breakdown: [],
              dataFreshness: new Date().toISOString(),
              source: 'MOCK'
            };
          }

          var breakdownItems = responseJson.breakdown.map(function(item) {
            return new BreakdownItemModel({
              categoryCode: item.categoryCode,
              categoryLabel: item.categoryLabel,
              amount: item.amount,
              percentage: item.percentage
            });
          });

          var model = new MonthlySummaryModel({
            accountId: responseJson.accountId,
            month: responseJson.month,
            totalSpend: responseJson.totalSpend,
            transactionCount: responseJson.transactionCount,
            averageTransactionValue: responseJson.averageTransactionValue,
            currencyCode: responseJson.currencyCode,
            breakdownItems: breakdownItems,
            dataFreshness: responseJson.dataFreshness,
            source: responseJson.source
          });

          deferred.resolve(model);
        }, delay);
      }).catch(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };
  }
})();
