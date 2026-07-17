'use strict';

(function () {
  function InsightPreferencesController(InsightPreferenceService,
                                        SecurityContextService,
                                        AuditEventService,
                                        $log) {
    'ngInject';
    var vm = this;

    vm.model = null;
    vm.loading = false;
    vm.error = null;
    vm.success = null;

    vm.init = function () {
      vm.loading = true;
      vm.error = null;
      InsightPreferenceService.loadPreferences()
        .then(function (data) {
          vm.model = angular.copy(data);
        })
        .catch(function (err) {
          vm.error = 'Unable to load preferences.';
          $log.error('Error loading insight preferences', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.savePreferences = function (form) {
      vm.error = null;
      vm.success = null;
      if (form && form.$invalid) {
        vm.error = 'Please correct validation errors before saving.';
        return;
      }
      if (vm.model && vm.model.insightsEnabled) {
        var channels = vm.model.notificationChannels || {};
        if (!channels.IN_APP && !channels.EMAIL && !channels.PUSH) {
          vm.error = 'Select at least one notification channel.';
          return;
        }
      }
      InsightPreferenceService.savePreferences(vm.model)
        .then(function (data) {
          vm.model = angular.copy(data);
          vm.success = 'Preferences saved.';
          AuditEventService.logEvent('INSIGHT_PREFERENCES_UPDATED', {});
        })
        .catch(function (err) {
          vm.error = 'Failed to save preferences.';
          $log.error('Error saving insight preferences', err);
        });
    };

    vm.resetToDefaults = function () {
      vm.init();
    };

    vm.init();
  }

  angular
    .module('davBanking.personalInsights')
    .controller('InsightPreferencesController', InsightPreferencesController);
})();
