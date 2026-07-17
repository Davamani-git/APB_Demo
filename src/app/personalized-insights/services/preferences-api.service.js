'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.services')
    .service('PreferencesApiService', PreferencesApiService);

  PreferencesApiService.$inject = ['$http', '$q', 'ENV_CONFIG', 'UserPreferencesModel', 'ErrorHandlerService'];

  function PreferencesApiService($http, $q, ENV_CONFIG, UserPreferencesModel, ErrorHandlerService) {
    this.getPreferences = function () {
      return $http.get(ENV_CONFIG.API_BASE_URL + '/insights/preferences')
        .then(function (response) {
          return UserPreferencesModel.create(response.data || {});
        })
        .catch(function (error) {
          throw ErrorHandlerService.handle(error, 'getPreferences');
        });
    };

    this.updatePreferences = function (preferences) {
      var body = preferences;
      if (preferences && typeof preferences.toJSON === 'function') {
        body = preferences.toJSON();
      }
      return $http.put(ENV_CONFIG.API_BASE_URL + '/insights/preferences', body)
        .then(function (response) {
          return UserPreferencesModel.create(response.data || {});
        })
        .catch(function (error) {
          throw ErrorHandlerService.handle(error, 'updatePreferences');
        });
    };
  }
})();
