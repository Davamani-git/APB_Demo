'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .factory('InsightModel', InsightModelFactory);

  InsightModelFactory.$inject = [];

  function InsightModelFactory() {
    function InsightModel(data) {
      this.id = data.id || '';
      this.title = data.title || '';
      this.category = data.category || '';
      this.severity = data.severity || 'LOW';
      this.summary = data.summary || '';
      this.details = data.details || null;
      this.actions = Array.isArray(data.actions) ? data.actions : [];
      this.actionLabel = data.actionLabel || '';
      this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
      this.validUntil = data.validUntil ? new Date(data.validUntil) : null;
      this.lineageId = data.lineageId || '';
      this.modelVersion = data.modelVersion || '';
      this.explanation = sanitizeExplanation(data.explanation || null);
      this.state = data.state || 'NEW';
    }

    InsightModel.prototype.isActionable = function () {
      return this.actions && this.actions.length > 0 && !this.isExpired();
    };

    InsightModel.prototype.isExpired = function () {
      return this.validUntil ? this.validUntil.getTime() < Date.now() : false;
    };

    function sanitizeExplanation(explanation) {
      if (!explanation) {
        return null;
      }
      var sanitized = {};
      Object.keys(explanation).forEach(function (key) {
        var value = explanation[key];
        if (typeof value === 'string') {
          sanitized[key] = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        } else {
          sanitized[key] = value;
        }
      });
      return sanitized;
    }

    function create(rawInsight) {
      if (!rawInsight || !rawInsight.id || !rawInsight.title || !rawInsight.category || !rawInsight.summary) {
        throw new Error('Invalid InsightModel payload');
      }
      return new InsightModel(rawInsight);
    }

    return {
      create: create
    };
  }
})();
