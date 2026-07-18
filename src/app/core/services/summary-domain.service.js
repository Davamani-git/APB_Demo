(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('SummaryDomainService', SummaryDomainService);

  SummaryDomainService.$inject = [
    'EnvConfigService',
    'SummaryApiService',
    'SummaryMockService',
    'MonthContextService',
    'KpiDomainService',
    'BreakdownDomainService',
    '$q',
    'MonthlySummaryModel',
    'BreakdownItemModel',
    'ErrorModel',
    'ERROR_CODES',
    '$http'
  ];

  function SummaryDomainService(
    EnvConfigService,
    SummaryApiService,
    SummaryMockService,
    MonthContextService,
    KpiDomainService,
    BreakdownDomainService,
    $q,
    MonthlySummaryModel,
    BreakdownItemModel,
    ErrorModel,
    ERROR_CODES,
    $http
  ) {
    var self = this;

    self.getMonthlySummary = function(accountId, month) {
      var deferred = $q.defer();

      MonthContextService.resolveMonthContext(month)
        .then(function() {
          return EnvConfigService.loadEnvConfig();
        })
        .then(function(env) {
          var useMock = !!env.useMockData;
          var summaryPromise;

          if (useMock) {
            summaryPromise = SummaryMockService.getMonthlySummary(accountId, month);
          } else {
            summaryPromise = SummaryApiService.getMonthlySummary(accountId, month);
          }

          return summaryPromise.then(function(model) {
            if (!(model instanceof MonthlySummaryModel)) {
              model = new MonthlySummaryModel(model || {});
            }

            // If feature flag disable breakdown, drop items
            return $http.get('app/core/config/feature-flags.config.json').then(function(response) {
              var flags = response.data && response.data.features ? response.data.features : {};
              if (flags.enableBasicBreakdown === false) {
                model.breakdownItems = [];
              } else if (!Array.isArray(model.breakdownItems) || model.breakdownItems.length === 0) {
                // If backend provided raw breakdown, compute domain breakdown (here we assume model.breakdownItems already mapped)
                model.breakdownItems = [];
              }

              // compute KPIs from breakdown if needed
              if (model.breakdownItems && model.breakdownItems.length > 0) {
                var aggregates = model.breakdownItems.map(function(item) {
                  return { amount: item.amount, count: 0 };
                });
                var kpis = KpiDomainService.computeKpis(aggregates);
                if (model.totalSpend === 0 && kpis.totalSpend > 0) {
                  model.totalSpend = kpis.totalSpend;
                }
                if (model.transactionCount === 0 && kpis.transactionCount > 0) {
                  model.transactionCount = kpis.transactionCount;
                }
                if (model.averageTransactionValue === 0 && kpis.averageTransactionValue > 0) {
                  model.averageTransactionValue = kpis.averageTransactionValue;
                }
              }

              deferred.resolve(model);
            });
          });
        })
        .catch(function(error) {
          if (!(error instanceof ErrorModel)) {
            error = new ErrorModel({
              code: error && error.code ? error.code : ERROR_CODES.SERVER_ERROR,
              httpStatus: error && error.httpStatus ? error.httpStatus : null,
              message: error && error.message ? error.message : 'An unexpected error occurred while retrieving your monthly summary.',
              details: error && error.details ? error.details : null,
              retryable: false
            });
          }
          deferred.reject(error);
        });

      return deferred.promise;
    };
  }
})();
