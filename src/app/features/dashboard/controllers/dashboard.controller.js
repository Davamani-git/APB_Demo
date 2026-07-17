(function () {
  'use strict';

  angular.module('app.dashboard')
    .controller('DashboardController', [
      'insightsApiService',
      'dashboardStateService',
      'validationUtils',
      'consentService',
      'telemetryService',
      'initialMonth',
      function (insightsApiService, dashboardStateService, validationUtils, consentService, telemetryService, initialMonth) {
        var vm = this;

        vm.month = initialMonth;
        vm.summary = null;
        vm.error = null;
        vm.isLoading = false;

        vm.onMonthChange = onMonthChange;
        vm.refresh = refresh;
        vm.hasData = hasData;
        vm.isConsentGranted = isConsentGranted;

        activate();

        function activate() {
          loadSummary(vm.month);
        }

        function syncState() {
          dashboardStateService.setSelectedMonth(vm.month);
          dashboardStateService.setSummary(vm.summary);
          dashboardStateService.setError(vm.error);
          dashboardStateService.setLoading(vm.isLoading);
        }

        function onMonthChange(newMonth) {
          vm.month = newMonth;
          telemetryService.logNavigation('MONTH_CHANGED', { month: newMonth });
          loadSummary(newMonth);
        }

        function refresh() {
          telemetryService.logNavigation('REFRESH_CLICKED', { month: vm.month });
          loadSummary(vm.month, true);
        }

        function loadSummary(month, forceReload) {
          if (!validationUtils.isValidMonth(month)) {
            vm.error = { code: 'INVALID_MONTH', message: 'Please select a valid month.' };
            vm.summary = null;
            vm.isLoading = false;
            syncState();
            return;
          }

          vm.isLoading = true;
          vm.error = null;
          syncState();

          insightsApiService.getMonthlySummary(month)
            .then(function (summary) {
              vm.summary = summary;
              vm.error = null;
            })
            .catch(function (err) {
              vm.error = err;
              vm.summary = null;
            })
            .finally(function () {
              vm.isLoading = false;
              syncState();
            });
        }

        function hasData() {
          return !!vm.summary && vm.summary.dataStatus !== 'UNAVAILABLE';
        }

        function isConsentGranted() {
          return vm.summary && consentService.isConsentGranted(vm.summary);
        }
      }
    ]);
}());
