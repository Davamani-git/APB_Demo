'use strict';

(function () {
  function BillReminderPreferencesController(BillReminderPreferenceService, AuditEventService, $log) {
    'ngInject';
    var vm = this;

    vm.model = null;
    vm.loading = false;
    vm.error = null;
    vm.success = null;

    vm.init = function () {
      vm.loading = true;
      vm.error = null;
      BillReminderPreferenceService.loadPreferences()
        .then(function (data) {
          vm.model = angular.copy(data);
        })
        .catch(function (err) {
          vm.error = 'Unable to load preferences.';
          $log.error('Error loading bill reminder preferences', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.save = function (form) {
      vm.error = null;
      vm.success = null;
      if (form && form.$invalid) {
        vm.error = 'Please correct validation errors.';
        return;
      }
      BillReminderPreferenceService.savePreferences(vm.model)
        .then(function (data) {
          vm.model = angular.copy(data);
          vm.success = 'Preferences saved.';
          AuditEventService.logEvent('BILL_REMINDER_PREFERENCES_UPDATED', {});
        })
        .catch(function (err) {
          vm.error = 'Failed to save preferences.';
          $log.error('Error saving bill reminder preferences', err);
        });
    };

    vm.reset = function () {
      vm.init();
    };

    vm.init();
  }

  angular
    .module('davBanking.billReminders')
    .controller('BillReminderPreferencesController', BillReminderPreferencesController);
})();
