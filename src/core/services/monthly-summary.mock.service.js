(function () {
    'use strict';

    MonthlySummaryMockService.$inject = ['$q', '$timeout', 'EnvConfigService'];

    function MonthlySummaryMockService($q, $timeout, EnvConfigService) {
        var env = EnvConfigService.getActiveEnv();

        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(requestModel) {
            var deferred = $q.defer();
            var delayMs = 500;

            $timeout(function () {
                if (requestModel.month === '1900-01') {
                    deferred.reject({
                        status: 503,
                        data: {
                            code: 'DOWNSTREAM_UNAVAILABLE',
                            message: 'Summary temporarily unavailable.'
                        }
                    });
                    return;
                }

                var mockResponse = {
                    customerId: requestModel.customerId,
                    accountId: requestModel.accountId,
                    month: requestModel.month,
                    currencyCode: 'USD',
                    totalSpend: 1234.56,
                    transactionCount: 42,
                    averageTransactionAmount: 29.39,
                    maxTransactionAmount: 250.0,
                    minTransactionAmount: 3.5,
                    lastUpdatedUtc: '2024-05-31T23:59:59Z',
                    breakdown: [
                        {
                            categoryCode: 'GROCERIES',
                            categoryLabel: 'Groceries',
                            totalAmount: 345.67,
                            transactionCount: 10
                        },
                        {
                            categoryCode: 'TRAVEL',
                            categoryLabel: 'Travel',
                            totalAmount: 500.0,
                            transactionCount: 5
                        },
                        {
                            categoryCode: 'ONLINE',
                            categoryLabel: 'Online Retail',
                            totalAmount: 388.89,
                            transactionCount: 27
                        }
                    ]
                };

                deferred.resolve({
                    status: 200,
                    data: mockResponse
                });
            }, delayMs);

            return deferred.promise;
        }
    }

    angular
        .module('app')
        .service('MonthlySummaryMockService', MonthlySummaryMockService);
})();
