'use strict';

(function () {
  class InsightPreferenceService {
    constructor(InsightApiService, $q, $log) {
      'ngInject';
      this.InsightApiService = InsightApiService;
      this.$q = $q;
      this.$log = $log;
      this._preferences = null;
    }

    loadPreferences() {
      var self = this;
      return this.InsightApiService.getPreferences()
        .then(function (data) {
          self._preferences = data;
          return data;
        })
        .catch(function (err) {
          self.$log.error('Failed to load insight preferences', err);
          return self.$q.reject(err);
        });
    }

    getPreferences() {
      return this._preferences;
    }

    savePreferences(model) {
      var self = this;
      return this.InsightApiService.updatePreferences(model)
        .then(function (data) {
          self._preferences = data;
          return data;
        });
    }

    isInsightsEnabled() {
      return !!(this._preferences && this._preferences.insightsEnabled);
    }
  }

  angular
    .module('davBanking.personalInsights')
    .service('InsightPreferenceService', InsightPreferenceService);
})();
