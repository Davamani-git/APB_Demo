(function () {
    'use strict';

    MonthlySummaryService.$inject = ['ApiClient', 'ENV_CONFIG', 'LoggingService', 'MonthlySummaryModel', 'ErrorModel'];

    function MonthlySummaryService(ApiClient, ENV_CONFIG, LoggingService, MonthlySummaryModel, ErrorModel) {
        var service = {
            getSummary: getSummary
        };

        function getSummary(month) {
            var validationError = validateMonth(month);
            if (validationError) {
                var errorModel = new ErrorModel({
                    code: 'INVALID_MONTH',
                    message: 'The selected month is invalid.',
                    retryable: false
                });
                return Promise.reject(errorModel);
            }

            if (ENV_CONFIG.useMockData) {
                return window.MonthlySummaryMockService.getSummary(month);
            }

            var url = ENV_CONFIG.apiBaseUrl + '/spending/monthly-summary';
            var config = {
                params: {
                    month: month
                }
            };

            return ApiClient.get(url, config).then(function (response) {
                var data = response.data;
                var validationResult = validateResponse(data);
                if (!validationResult.isValid) {
                    LoggingService.error('Invalid monthly summary response', { month: month });
                    var invalidResponseError = new ErrorModel({
                        code: 'INVALID_RESPONSE',
                        message: 'We are unable to display your spending summary right now.',
                        retryable: true
                    });
                    return Promise.reject(invalidResponseError);
                }
                return new MonthlySummaryModel(mapResponse(data));
            }).catch(function (error) {
                LoggingService.error('Failed to retrieve monthly summary', { month: month });
                var errorModel = mapError(error);
                return Promise.reject(errorModel);
            });
        }

        function validateMonth(month) {
            if (!month || typeof month !== 'string') {
                return 'Month is required.';
            }
            var parts = month.split('-');
            if (parts.length !== 2) {
                return 'Invalid month format.';
            }
            var year = parseInt(parts[0], 10);
            var monthNumber = parseInt(parts[1], 10);
            if (isNaN(year) || isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
                return 'Invalid month value.';
            }
            return null;
        }

        function validateResponse(data) {
            var isValid = !!(data && typeof data.month === 'string' && typeof data.totalSpend === 'number' && typeof data.transactionCount === 'number' && typeof data.averageTransactionAmount === 'number' && typeof data.currency === 'string');
            return { isValid: isValid };
        }

        function mapResponse(data) {
            return {
                month: data.month,
                totalSpend: data.totalSpend,
                transactionCount: data.transactionCount,
                averageTransactionAmount: data.averageTransactionAmount,
                currency: data.currency,
                isPartial: !!data.isPartial,
                dataSource: data.dataSource || null
            };
        }

        function mapError(error) {
            var status = error.status || 0;
            var message = 'We are unable to display your spending summary right now. Please try again later.';
            var code = 'SERVICE_UNAVAILABLE';
            var retryable = true;

            if (status === 404) {
                code = 'MONTH_NOT_FOUND';
                message = 'We could not find spending data for the selected month.';
                retryable = false;
            } else if (status === 400) {
                code = 'INVALID_MONTH';
                message = 'The selected month is not valid.';
                retryable = false;
            }

            return new ErrorModel({
                code: code,
                message: message,
                retryable: retryable
            });
        }

        return service;
    }

    angular.module('app')
        .service('MonthlySummaryService', MonthlySummaryService);
})();
