(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .factory('InsightsFeedbackModel', InsightsFeedbackModelFactory);

  function InsightsFeedbackModelFactory() {
    class InsightsFeedbackModel {
      constructor(dto) {
        dto = dto || {};
        this.insightId = dto.insightId || '';
        this.feedbackType = dto.feedbackType || 'USEFUL';
        this.comment = dto.comment || '';
        this.channel = dto.channel || 'WEB';
        this.timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
      }
    }

    return InsightsFeedbackModel;
  }
})();
