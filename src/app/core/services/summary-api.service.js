(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('SummaryApiService', SummaryApiService);

  SummaryApiService.$inject = ['$http', '$q', 'EnvConfigService', 'MonthlySummaryModel', 'BreakdownItemModel'];

  function SummaryApiService($http, $q, EnvConfigService, MonthlySummaryModel, BreakdownItemModel) {
    var self = this;

    self.getMonthlySummary = function(accountId, month) {
      var deferred = $q.defer();

      EnvConfigService.loadEnvConfig().then(function(env) {
        var url = env.apiBaseUrl.replace(/\/$/, '') + '/summary';
        var config = {
          params: {
            accountId: accountId,
            month: month
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };

        $http.get(url, config).then(function(response) {
          var data = response.data || {};
          var breakdownArray = Array.isArray(data.breakdown) ? data.breakdown : [];
          var breakdownItems = breakdownArray.map(function(item) {
            return new BreakdownItemModel({
              categoryCode: item.categoryCode,
              categoryLabel: item.categoryLabel,
              amount: item.amount,
              percentage: item.percentage
            });
          });

          var model = new MonthlySummaryModel({
            accountId: data.accountId,
            month: data.month,
            totalSpend: data.totalSpend,
            transactionCount: data.transactionCount,
            averageTransactionValue: data.averageTransactionValue,
            currencyCode: data.currencyCode,
            breakdownItems: breakdownItems,
            dataFreshness: data.dataFreshness,
            source: data.source
          });

          deferred.resolve(model);
        }).catch(function(error) {
          deferred.reject(error);
        });
      }).catch(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };
  }
})();
