'use strict';

(function () {
  class RecommendationModelService {
    constructor($log) {
      'ngInject';
      this.$log = $log;
      this._recommendations = [];
    }

    setRecommendations(list) {
      this._recommendations = (list || []).map(item => this._normalize(item));
    }

    _normalize(item) {
      if (!item) { return null; }
      var model = {
        id: item.id,
        title: item.title,
        shortDescription: item.shortDescription,
        description: item.description,
        type: item.type,
        segment: item.segment,
        eligibility: item.eligibility || { isEligible: true },
        risk: item.risk || { level: 'MEDIUM', score: null },
        expectedBenefit: item.expectedBenefit || {},
        context: item.context || null,
        explanation: item.explanation || {},
        compliance: item.compliance || {},
        actions: item.actions || [],
        createdAt: item.createdAt ? new Date(item.createdAt) : null
      };
      if (!model.id) {
        this.$log.warn('Invalid recommendation payload', item);
      }
      return model;
    }

    getRecommendations() {
      return this._recommendations;
    }

    getRecommendationById(id) {
      return this._recommendations.find(r => r.id === id) || null;
    }

    updateRecommendation(rec) {
      if (!rec || !rec.id) { return; }
      var idx = this._recommendations.findIndex(r => r.id === rec.id);
      if (idx >= 0) {
        this._recommendations[idx] = rec;
      } else {
        this._recommendations.push(rec);
      }
    }

    clear() {
      this._recommendations = [];
    }
  }

  angular
    .module('davBanking.contextRecommendations')
    .service('RecommendationModelService', RecommendationModelService);
})();
