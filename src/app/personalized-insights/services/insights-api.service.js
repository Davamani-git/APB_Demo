'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.services')
    .service('InsightsApiService', InsightsApiService);

  InsightsApiService.$inject = ['$http', '$q', 'ENV_CONFIG', 'InsightMapper', 'ErrorHandlerService', 'LoggingService', 'CacheService'];

  function InsightsApiService($http, $q, ENV_CONFIG, InsightMapper, ErrorHandlerService, LoggingService, CacheService) {
    var CACHE_KEY_CURRENT = 'current_insights';

    this.getCurrentInsights = function (params) {
      var config = { params: params || {} };
      return $http.get(ENV_CONFIG.API_BASE_URL + '/insights/current', config)
        .then(function (response) {
          var models = InsightMapper.mapFromApi(response.data || {});
          CacheService.set(CACHE_KEY_CURRENT, models);
          return models;
        })
        .catch(function (error) {
          LoggingService.warn('Failed to fetch current insights, attempting cache', error);
          var cached = CacheService.get(CACHE_KEY_CURRENT);
          if (cached) {
            return cached;
          }
          throw ErrorHandlerService.handle({ code: 'INSIGHTS_UNAVAILABLE', status: error.status, original: error }, 'getCurrentInsights');
        });
    };

    this.getInsightById = function (insightId) {
      if (!insightId) {
        return $q.reject(new Error('insightId is required'));
      }
      return $http.get(ENV_CONFIG.API_BASE_URL + '/insights/' + encodeURIComponent(insightId))
        .then(function (response) {
          return InsightMapper.mapFromApi({ insights: [response.data] })[0] || null;
        })
        .catch(function (error) {
          throw ErrorHandlerService.handle(error, 'getInsightById');
        });
    };

    this.acknowledgeInsight = function (insightId, action) {
      if (!insightId || !action) {
        return $q.reject(new Error('insightId and action are required'));
      }
      var payload = {
        action: action,
        actionAt: new Date().toISOString(),
        metadata: {
          source: 'WEB',
          device: 'DESKTOP'
        }
      };
      return $http.post(ENV_CONFIG.API_BASE_URL + '/insights/' + encodeURIComponent(insightId) + '/actions', payload)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          throw ErrorHandlerService.handle(error, 'acknowledgeInsight');
        });
    };

    this.refreshInsights = function () {
      CacheService.clear(CACHE_KEY_CURRENT);
      return this.getCurrentInsights();
    };
  }
})();
