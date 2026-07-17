(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .factory('InsightModel', InsightModelFactory);

  function InsightModelFactory() {
    class InsightModel {
      constructor(dto) {
        dto = dto || {};
        this.id = dto.id || '';
        this.title = dto.title || '';
        this.summary = dto.summary || '';
        this.category = dto.category || '';
        this.timeWindow = {
          from: dto.timeWindow && dto.timeWindow.from ? new Date(dto.timeWindow.from) : null,
          to: dto.timeWindow && dto.timeWindow.to ? new Date(dto.timeWindow.to) : null
        };
        this.confidenceScore = typeof dto.confidenceScore === 'number' ? dto.confidenceScore : 0;
        this.segment = dto.segment || '';
        this.createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
        this.explanation = dto.explanation || '';
        this.actions = Array.isArray(dto.actions) ? dto.actions : [];
        this.metadata = dto.metadata || {};
        this.state = dto.state || 'ACTIVE';
      }

      isValid() {
        const hasMandatory = this.id && this.title && this.category && this.timeWindow.from && this.timeWindow.to;
        const cs = this.confidenceScore;
        const scoreValid = cs >= 0 && cs <= 1;
        return hasMandatory && scoreValid;
      }
    }

    return InsightModel;
  }
})();
