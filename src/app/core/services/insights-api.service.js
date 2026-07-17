(function () {
  'use strict';

  angular.module('app.core')
    .service('insightsApiService', ['$http', '$q', 'envConfig', 'apiConfig', 'MonthlySummary', 'errorMapperService',
      function ($http, $q, envConfig, apiConfig, MonthlySummary, errorMapperService) {
        // Dedicated mock provider for monthly summary
        function getMonthlySummaryMock(month) {
          // Simple deterministic mock based on month string to keep behavior stable
          var baseAmount = 1200;
          var numericMonth = parseInt(month.split('-')[1], 10);
          var multiplier = 0.8 + (numericMonth % 5) * 0.1;
          var totalSpend = parseFloat((baseAmount * multiplier).toFixed(2));
          var transactionCount = 20 + (numericMonth * 3);
          var averageTransactionAmount = totalSpend / transactionCount;

          var dto = {
            month: month,
            currency: 'USD',
            totalSpend: totalSpend,
            transactionCount: transactionCount,
            averageTransactionAmount: parseFloat(averageTransactionAmount.toFixed(2)),
            categoryBreakdown: [
              { categoryCode: 'GROCERIES', categoryLabel: 'Groceries', amount: parseFloat((totalSpend * 0.35).toFixed(2)), percentage: 35 },
              { categoryCode: 'TRAVEL', categoryLabel: 'Travel', amount: parseFloat((totalSpend * 0.25).toFixed(2)), percentage: 25 },
              { categoryCode: 'DINING', categoryLabel: 'Dining', amount: parseFloat((totalSpend * 0.15).toFixed(2)), percentage: 15 },
              { categoryCode: 'OTHER', categoryLabel: 'Other', amount: parseFloat((totalSpend * 0.25).toFixed(2)), percentage: 25 }
            ],
            dataStatus: 'COMPLETED',
            partialDataReason: null,
            consentStatus: 'GRANTED',
            generatedAt: new Date().toISOString(),
            source: 'ISD'
          };

          var deferred = $q.defer();
          // Simulate async latency
          setTimeout(function () {
            try {
              deferred.resolve(MonthlySummary.fromDto(dto));
            } catch (e) {
              var clientError = errorMapperService.mapHttpError({
                status: 500,
                data: {
                  errorCode: 'SERVICE_UNAVAILABLE',
                  message: 'Mock mapping error'
                }
              });
              deferred.reject(clientError);
            }
          }, 300);

          return deferred.promise;
        }

        this.getMonthlySummary = function (month) {
          if (envConfig.useMockApi) {
            return getMonthlySummaryMock(month);
          }

          var config = {
            params: { month: month },
            timeout: apiConfig.monthlySummary.timeoutMs
          };

          return $http.get(envConfig.apiBaseUrl + apiConfig.monthlySummary.path, config)
            .then(function (response) {
              return MonthlySummary.fromDto(response.data);
            })
            .catch(function (rejection) {
              var clientError = errorMapperService.mapHttpError(rejection);
              return $q.reject(clientError);
            });
        };
      }
    ]);
}());
