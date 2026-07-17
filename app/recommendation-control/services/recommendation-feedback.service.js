'use strict';

(function () {
  class RecommendationFeedbackService {
    constructor(RecommendationControlApiService, AuditEventService, $q, $log) {
      'ngInject';
      this.RecommendationControlApiService = RecommendationControlApiService;
      this.AuditEventService = AuditEventService;
      this.$q = $q;
      this.$log = $log;
      this._inFlight = {};
    }

    _key(recId, action) {
      return recId + ':' + action;
    }

    confirm(recommendation, context) {
      if (!recommendation || !recommendation.id) {
        return this.$q.reject('INVALID_RECOMMENDATION');
      }
      var key = this._key(recommendation.id, 'CONFIRM');
      if (this._inFlight[key]) {
        return this._inFlight[key];
      }
      var self = this;
      var promise = this.RecommendationControlApiService.confirmRecommendation(recommendation.id, context)
        .then(function (data) {
          self.AuditEventService.logEvent('RECOMMENDATION_CONFIRMED', { recommendationId: recommendation.id });
          return data;
        })
        .catch(function (err) {
          self.$log.error('Confirm recommendation failed', err);
          return self.$q.reject(err);
        })
        .finally(function () {
          delete self._inFlight[key];
        });
      this._inFlight[key] = promise;
      return promise;
    }

    dismiss(recommendation, reason, context) {
      if (!recommendation || !recommendation.id) {
        return this.$q.reject('INVALID_RECOMMENDATION');
      }
      var key = this._key(recommendation.id, 'DISMISS');
      if (this._inFlight[key]) {
        return this._inFlight[key];
      }
      var self = this;
      var promise = this.RecommendationControlApiService.dismissRecommendation(recommendation.id, reason, context)
        .then(function (data) {
          self.AuditEventService.logEvent('RECOMMENDATION_DISMISSED', { recommendationId: recommendation.id, reason: reason });
          return data;
        })
        .catch(function (err) {
          self.$log.error('Dismiss recommendation failed', err);
          return self.$q.reject(err);
        })
        .finally(function () {
          delete self._inFlight[key];
        });
      this._inFlight[key] = promise;
      return promise;
    }

    getHistory(params) {
      return this.RecommendationControlApiService.getHistory(params);
    }
  }

  angular
    .module('davBanking.recommendationControl')
    .service('RecommendationFeedbackService', RecommendationFeedbackService);
})();
