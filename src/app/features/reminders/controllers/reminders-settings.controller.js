(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .controller('RemindersSettingsController', RemindersSettingsController);

  RemindersSettingsController.$inject = ['RemindersPreferencesService', 'LoggingService', 'ReminderPreferencesModel'];

  function RemindersSettingsController(RemindersPreferencesService, LoggingService, ReminderPreferencesModel) {
    const vm = this;

    vm.preferences = new ReminderPreferencesModel();
    vm.isSaving = false;
    vm.error = null;

    vm.loadPreferences = loadPreferences;
    vm.savePreferences = savePreferences;

    activate();

    function activate() {
      loadPreferences();
    }

    function loadPreferences() {
      RemindersPreferencesService.getPreferences()
        .then(function (data) {
          vm.preferences = new ReminderPreferencesModel(data);
        })
        .catch(function () {
          // Use defaults on error
          vm.preferences = new ReminderPreferencesModel();
        });
    }

    function savePreferences() {
      vm.error = null;
      vm.isSaving = true;
      if (!vm.preferences.isLeadTimeValid()) {
        vm.error = { message: 'Lead time must be between 0 and 30 days.' };
        vm.isSaving = false;
        return;
      }
      RemindersPreferencesService.updatePreferences(vm.preferences)
        .then(function () {
          LoggingService.info('Reminder preferences saved', {});
        })
        .catch(function (err) {
          vm.error = err;
        })
        .finally(function () {
          vm.isSaving = false;
        });
    }
  }
})();
