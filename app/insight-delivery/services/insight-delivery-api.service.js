'use strict';

(function () {
  class InsightDeliveryApiService {
    constructor($http, $q, INSIGHT_DELIVERY_API_BASE_URL) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.baseUrl = INSIGHT_DELIVERY_API_BASE_URL;
      this._cachedConsent = null;
    }

    getGlobalConsent() {
      if (this._cachedConsent) {
        return this.$q.resolve(this._cachedConsent);
      }
      return this.$http.get(this.baseUrl + '/consent')
        .then(resp => {
          this._cachedConsent = resp.data;
          return resp.data;
        });
    }

    updateGlobalConsent(payload) {
      return this.$http.put(this.baseUrl + '/consent', payload)
        .then(resp => {
          this._cachedConsent = resp.data;
          return resp.data;
        });
    }

    getPolicyInfo(insightId) {
      return this.$http.get(this.baseUrl + '/policy/insights/' + encodeURIComponent(insightId))
        .then(resp => resp.data);
    }
  }

  angular
    .module('davBanking.insightDelivery')
    .service('InsightDeliveryApiService', InsightDeliveryApiService);
})();
