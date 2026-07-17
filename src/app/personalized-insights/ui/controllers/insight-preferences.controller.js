'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.ui')
    .controller('InsightPreferencesController', InsightPreferencesController);

  InsightPreferencesController.$inject = ['PreferencesApiService', 'ErrorHandlerService', 'UserPreferencesModel'];

  function InsightPreferencesController(PreferencesApiService, ErrorHandlerService, UserPreferencesModel) {
    var vm = this;

    vm.preferences = UserPreferencesModel.create();
    vm.state = 'loading';
    vm.errorMessage = '';

    vm.loadPreferences = loadPreferences;
    vm.savePreferences = savePreferences;

    loadPreferences();

    function loadPreferences() {
      vm.state = 'loading';
      PreferencesApiService.getPreferences()
        .then(function (prefs) {
          vm.preferences = prefs;
          vm.state = 'loaded';
        })
        .catch(function (error) {
          var clientError = error && error.message ? error : ErrorHandlerService.handle(error, 'loadPreferences');
          vm.state = 'error';
          vm.errorMessage = clientError.message;
        });
    }

    function savePreferences() {
      vm.state = 'saving';
      PreferencesApiService.updatePreferences(vm.preferences)
        .then(function (prefs) {
          vm.preferences = prefs;
          vm.state = 'loaded';
        })
        .catch(function (error) {
          var clientError = error && error.message ? error : ErrorHandlerService.handle(error, 'savePreferences');
          vm.state = 'error';
          vm.errorMessage = clientError.message;
        });
    }
  }
})();
