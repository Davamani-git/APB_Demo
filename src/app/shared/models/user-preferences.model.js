'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .factory('UserPreferencesModel', UserPreferencesModelFactory);

  UserPreferencesModelFactory.$inject = [];

  function UserPreferencesModelFactory() {
    function UserPreferencesModel(data) {
      data = data || {};
      this.categoriesEnabled = Array.isArray(data.categoriesEnabled) ? data.categoriesEnabled : [];
      this.notifications = data.notifications || { email: false, push: false };
      this.consent = data.consent || { insightsProcessing: false, thirdPartySharing: false };
    }

    UserPreferencesModel.prototype.hasConsent = function (category) {
      return !!this.consent && this.consent.insightsProcessing === true;
    };

    UserPreferencesModel.prototype.isCategoryEnabled = function (category) {
      if (!this.categoriesEnabled || this.categoriesEnabled.length === 0) {
        return true;
      }
      return this.categoriesEnabled.indexOf(category) !== -1;
    };

    function create(rawPrefs) {
      return new UserPreferencesModel(rawPrefs || {});
    }

    return {
      create: create
    };
  }
})();
