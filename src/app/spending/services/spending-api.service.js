(function () {
  'use strict';

  SpendingApiService.$inject = ['$http', '$q', 'EnvConfigService', 'LoggingService', 'SpendSummaryModel', 'MetricsModel'];

  angular
    .module('app')
    .service('SpendingApiService', SpendingApiService);

  function SpendingApiService($http, $q, EnvConfigService, LoggingService, SpendSummaryModel, MetricsModel) {
    var self = this;

    self.getMonthlySummary = getMonthlySummary;

    function getMonthlySummary(cardId, month) {
      var deferred = $q.defer();
      var config = EnvConfigService.getConfig();
      var url = _buildUrl(config.apiBaseUrl, cardId, month);

      var httpConfig = {
        method: 'GET',
        url: url,
        params: {
          cardId: cardId,
          month: month
        },
        timeout: config.apiTimeoutMs
      };

      $http(httpConfig)
        .then(function (response) {
          var summaryModel = _mapResponseToModel(response.data || {});
          deferred.resolve(summaryModel);
        })
        .catch(function (errorModel) {
          // HttpInterceptor already mapped error; propagate
          deferred.reject(errorModel);
        });

      return deferred.promise;
    }

    function _buildUrl(apiBaseUrl, cardId, month) {
      var base = apiBaseUrl || '';
      if (base.charAt(base.length - 1) === '/') {
        base = base.substring(0, base.length - 1);
      }
      return base + '/spend-summary';
    }

    function _mapResponseToModel(raw) {
      var metrics = new MetricsModel(raw.metrics || {});
      var props = {
        cardId: raw.cardId,
        month: raw.month,
        currency: raw.currency,
        metrics: metrics,
        breakdown: raw.breakdown || {},
        lastUpdated: raw.lastUpdated
      };
      return new SpendSummaryModel(props);
    }
  }
})();
