'use strict';

(function () {
  class InsightApiService {
    constructor($http, $q, PERSONAL_INSIGHTS_API_BASE_URL) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.baseUrl = PERSONAL_INSIGHTS_API_BASE_URL;
    }

    getInsights(params) {
      return this.$http.get(this.baseUrl + '/insights', { params: params })
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getInsightDetail(insightId) {
      return this.$http.get(this.baseUrl + '/insights/' + encodeURIComponent(insightId))
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getPreferences() {
      return this.$http.get(this.baseUrl + '/preferences')
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    updatePreferences(preferences) {
      return this.$http.put(this.baseUrl + '/preferences', preferences)
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    dismissInsight(insightId) {
      return this.$http.post(this.baseUrl + '/insights/' + encodeURIComponent(insightId) + '/dismiss', { reason: 'USER_DISMISS' })
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    sendInsightFeedback(insightId, payload) {
      return this.$http.post(this.baseUrl + '/insights/' + encodeURIComponent(insightId) + '/feedback', payload)
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }
  }

  angular
    .module('davBanking.personalInsights')
    .service('InsightApiService', InsightApiService);
})();
