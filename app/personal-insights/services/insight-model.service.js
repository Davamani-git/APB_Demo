'use strict';

(function () {
  class InsightModelService {
    constructor($log) {
      'ngInject';
      this.$log = $log;
      this._insights = [];
    }

    setInsights(list) {
      this._insights = (list || []).map(item => this._normalize(item));
    }

    _normalize(item) {
      if (!item) { return null; }
      var model = {
        id: item.id,
        title: item.title,
        summary: item.summary,
        description: item.description,
        category: item.category,
        severity: item.severity,
        impactAmount: item.impactAmount || 0,
        currency: item.currency,
        timeRange: item.timeRange,
        timeSeries: item.timeSeries || [],
        relatedAccounts: item.relatedAccounts || [],
        isRead: !!item.isRead,
        isDismissed: !!item.isDismissed,
        jurisdiction: item.jurisdiction,
        isViewable: angular.isDefined(item.isViewable) ? !!item.isViewable : true,
        lineageId: item.lineageId,
        createdAt: item.createdAt ? new Date(item.createdAt) : null,
        lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
        policy: item.policy || null
      };
      if (!model.id || !model.title || !model.category || !model.severity || !model.jurisdiction) {
        this.$log.warn('Invalid InsightModel received', item);
      }
      return model;
    }

    getInsights() {
      return this._insights;
    }

    getInsightById(id) {
      return this._insights.find(i => i.id === id) || null;
    }

    updateInsight(insight) {
      if (!insight || !insight.id) { return; }
      var idx = this._insights.findIndex(i => i.id === insight.id);
      if (idx >= 0) {
        this._insights[idx] = insight;
      } else {
        this._insights.push(insight);
      }
    }

    clear() {
      this._insights = [];
    }
  }

  angular
    .module('davBanking.personalInsights')
    .service('InsightModelService', InsightModelService);
})();
