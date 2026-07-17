'use strict';

(function () {
  class RecommendationPreferenceService {
    constructor(RecommendationApiService, $q, $log) {
      'ngInject';
      this.RecommendationApiService = RecommendationApiService;
      this.$q = $q;
      this.$log = $log;
      this._preferences = null;
    }

    loadPreferences() {
      var self = this;
      return this.RecommendationApiService.getPreferences()
        .then(function (data) {
          self._preferences = data;
          return data;
        })
        .catch(function (err) {
          self.$log.error('Failed to load recommendation preferences', err);
          return self.$q.reject(err);
        });
    }

    getPreferences() {
      return this._preferences;
    }

    savePreferences(pref) {
      var self = this;
      return this.RecommendationApiService.updatePreferences(pref)
        .then(function (data) {
          self._preferences = data;
          return data;
        });
    }

    isRecommendationsEnabled() {
      return !!(this._preferences && this._preferences.recommendationsEnabled);
    }
  }

  angular
    .module('davBanking.contextRecommendations')
    .service('RecommendationPreferenceService', RecommendationPreferenceService);
})();
