(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .service('InsightsService', InsightsService);

  InsightsService.$inject = ['ApiGatewayService', 'InsightsCacheService', 'LoggingService', 'ErrorHandlerService', 'InsightModel'];

  function InsightsService(ApiGatewayService, InsightsCacheService, LoggingService, ErrorHandlerService, InsightModel) {
    this.getInsights = function (query) {
      const key = buildQueryKey(query);
      const cached = InsightsCacheService.getCachedInsights(key);
      if (cached) {
        return Promise.resolve(cached);
      }

      const params = {
        fromDate: query.fromDate.toISOString().substr(0, 10),
        toDate: query.toDate.toISOString().substr(0, 10),
        category: query.category || undefined,
        segment: query.segment || undefined,
        page: query.page,
        pageSize: query.pageSize
      };

      return ApiGatewayService.get('INSIGHTS', '/insights', { params: params })
        .then(function (data) {
          const items = Array.isArray(data.items) ? data.items : [];
          const models = items.map(function (dto) { return new InsightModel(dto); });
          InsightsCacheService.setCachedInsights(key, models);
          LoggingService.info('Insights loaded', { count: models.length });
          return models;
        })
        .catch(function (error) {
          const standardError = ErrorHandlerService.handleClientError(error);
          LoggingService.error('Failed to load insights', { error: standardError });
          throw standardError;
        });
    };

    this.getInsightById = function (insightId) {
      return ApiGatewayService.get('INSIGHTS', '/insights/' + encodeURIComponent(insightId))
        .then(function (data) {
          return new InsightModel(data);
        });
    };

    this.submitFeedback = function (feedbackModel) {
      const payload = {
        feedbackType: feedbackModel.feedbackType,
        comment: feedbackModel.comment || undefined,
        channel: feedbackModel.channel,
        timestamp: feedbackModel.timestamp.toISOString()
      };
      return ApiGatewayService.post('INSIGHTS', '/insights/' + encodeURIComponent(feedbackModel.insightId) + '/feedback', payload)
        .then(function () {
          LoggingService.info('Insight feedback submitted', { insightId: feedbackModel.insightId });
        });
    };

    this.hideInsight = function (insightId) {
      return ApiGatewayService.post('INSIGHTS', '/insights/' + encodeURIComponent(insightId) + '/hide', {})
        .then(function () {
          LoggingService.info('Insight hidden', { insightId: insightId });
        });
    };

    function buildQueryKey(query) {
      return [
        query.fromDate.toISOString().substr(0, 10),
        query.toDate.toISOString().substr(0, 10),
        query.category || '',
        query.segment || '',
        query.page,
        query.pageSize
      ].join('|');
    }
  }
})();
