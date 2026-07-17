'use strict';

(function () {
  class RecommendationApiService {
    constructor($http, $q, RECOMMENDATIONS_API_BASE_URL) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.baseUrl = RECOMMENDATIONS_API_BASE_URL;
    }

    getRecommendations(params) {
      return this.$http.get(this.baseUrl + '/recommendations', { params: params })
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getRecommendationDetail(id) {
      return this.$http.get(this.baseUrl + '/recommendations/' + encodeURIComponent(id))
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getPreferences() {
      return this.$http.get(this.baseUrl + '/preferences')
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    updatePreferences(payload) {
      return this.$http.put(this.baseUrl + '/preferences', payload)
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    confirmRecommendation(id, context) {
      return this.$http.post(this.baseUrl + '/recommendations/' + encodeURIComponent(id) + '/confirm', {
        sourceContext: context
      }).then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    dismissRecommendation(id, reason) {
      return this.$http.post(this.baseUrl + '/recommendations/' + encodeURIComponent(id) + '/dismiss', {
        reason: reason || 'USER_DISMISS'
      }).then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }
  }

  angular
    .module('davBanking.contextRecommendations')
    .service('RecommendationApiService', RecommendationApiService);
})();
