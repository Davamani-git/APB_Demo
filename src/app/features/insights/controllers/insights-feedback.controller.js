(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .controller('InsightsFeedbackController', InsightsFeedbackController);

  InsightsFeedbackController.$inject = ['InsightsService', 'LoggingService', 'ErrorHandlerService', 'InsightsFeedbackModel'];

  function InsightsFeedbackController(InsightsService, LoggingService, ErrorHandlerService, InsightsFeedbackModel) {
    const vm = this;

    vm.markUseful = markUseful;
    vm.markNotUseful = markNotUseful;
    vm.hideInsight = hideInsight;

    function markUseful() {
      submitFeedback('USEFUL');
    }

    function markNotUseful() {
      submitFeedback('NOT_USEFUL');
    }

    function submitFeedback(type) {
      if (!vm.insight || !vm.insight.id) {
        return;
      }
      const model = new InsightsFeedbackModel({
        insightId: vm.insight.id,
        feedbackType: type,
        channel: 'WEB'
      });
      InsightsService.submitFeedback(model)
        .then(function () {
          LoggingService.info('Feedback submitted', { insightId: vm.insight.id, type: type });
        })
        .catch(function (err) {
          const standardError = ErrorHandlerService.handleClientError(err);
          LoggingService.error('Failed to submit feedback', { error: standardError });
        });
    }

    function hideInsight() {
      if (!vm.insight || !vm.insight.id) {
        return;
      }
      InsightsService.hideInsight(vm.insight.id)
        .then(function () {
          LoggingService.info('Insight hidden by user', { insightId: vm.insight.id });
          vm.insight.state = 'HIDDEN';
        })
        .catch(function (err) {
          const standardError = ErrorHandlerService.handleClientError(err);
          LoggingService.error('Failed to hide insight', { error: standardError });
        });
    }
  }
})();
