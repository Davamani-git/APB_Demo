angular.module('davms.summary').service('SummaryApiService', SummaryApiService);

SummaryApiService.$inject = ['$http', '$q', 'ConfigService', 'LoggingService', 'ErrorHandlingService', 'MonthContextService'];
function SummaryApiService($http, $q, ConfigService, LoggingService, ErrorHandlingService, MonthContextService) {
  const baseUrl = ConfigService.getApiBaseUrl();
  const useMockData = ConfigService.useMockData();

  this.getMonthlySummary = function(accountId, monthKey) {
    const month = monthKey || MonthContextService.getSelectedMonth().key;
    
    LoggingService.info('REQUEST_MONTHLY_SUMMARY', { accountId: accountId, month: month });

    if (useMockData) {
      return getMockSummary(accountId, month);
    }

    const url = baseUrl + '/summary';
    const params = { accountId: accountId, month: month };

    return $http.get(url, { params: params })
      .then(function(response) {
        return response.data;
      })
      .catch(function(err) {
        const mapped = ErrorHandlingService.handleHttpError(err);
        return $q.reject(mapped);
      });
  };

  function getMockSummary(accountId, month) {
    const mockData = {
      accountId: accountId,
      month: month,
      currency: 'USD',
      totalAmount: 2847.63,
      transactionCount: 47,
      breakdown: [
        {
          categoryCode: 'FOOD',
          categoryLabel: 'Food & Dining',
          amount: 856.42,
          percentage: 30.1
        },
        {
          categoryCode: 'ONLINE',
          categoryLabel: 'Online Purchases',
          amount: 712.18,
          percentage: 25.0
        },
        {
          categoryCode: 'TRANSPORT',
          categoryLabel: 'Transportation',
          amount: 398.75,
          percentage: 14.0
        },
        {
          categoryCode: 'ENTERTAINMENT',
          categoryLabel: 'Entertainment',
          amount: 341.64,
          percentage: 12.0
        },
        {
          categoryCode: 'SHOPPING',
          categoryLabel: 'Shopping',
          amount: 284.76,
          percentage: 10.0
        },
        {
          categoryCode: 'OTHER',
          categoryLabel: 'Other',
          amount: 253.88,
          percentage: 8.9
        }
      ]
    };

    return $q.resolve(mockData);
  }
}