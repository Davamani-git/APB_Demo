'use strict';

(function () {
  class RecommendationControlApiService {
    constructor($http, $q, RECOMMENDATION_CONTROL_API_BASE_URL) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.baseUrl = RECOMMENDATION_CONTROL_API_BASE_URL;
    }

    confirmRecommendation(recId, context) {
      return this.$http.post(this.baseUrl + '/recommendations/' + encodeURIComponent(recId) + '/confirm', {
        context: context || null
      }).then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    dismissRecommendation(recId, reason, context) {
      return this.$http.post(this.baseUrl + '/recommendations/' + encodeURIComponent(recId) + '/dismiss', {
        reason: reason || 'USER_DISMISS',
        context: context || null
      }).then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getHistory(params) {
      return this.$http.get(this.baseUrl + '/feedback', { params: params })
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }
  }

  angular
    .module('davBanking.recommendationControl')
    .service('RecommendationControlApiService', RecommendationControlApiService);
})();
