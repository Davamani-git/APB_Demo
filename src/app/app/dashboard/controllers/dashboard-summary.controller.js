(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .controller('DashboardSummaryController', [
      '$rootScope',
      'dashboardSummaryService',
      'loggingService',
      'errorHandlerService',
      function ($rootScope, dashboardSummaryService, loggingService, errorHandlerService) {
        var vm = this;
        vm.summary = null;
        vm.isLoading = false;
        vm.isDegraded = false;
        vm.error = null;
        vm.fromDate = null;
        vm.toDate = null;

        vm.init = function () {
          var now = new Date();
          var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          vm.fromDate = firstDay;
          vm.toDate = now;
          loadSummary();
        };

        vm.refresh = function () {
          loadSummary();
        };

        function loadSummary() {
          vm.error = null;
          vm.isDegraded = false;

          var params = {
            fromDate: vm.fromDate,
            toDate: vm.toDate
          };

          var validationError = dashboardSummaryService.validateParams(params);
          if (validationError) {
            vm.error = validationError;
            return;
          }

          vm.isLoading = true;
          $rootScope.$broadcast('loading:start');

          dashboardSummaryService.getDashboardSummary(params)
            .then(function (summary) {
              vm.summary = summary;
              vm.isDegraded = !!summary.degraded;
              vm.error = null;
              loggingService.info('Dashboard summary loaded', {});
            })
            .catch(function (errorModel) {
              vm.error = errorModel;
              loggingService.error('Failed to load dashboard summary', {}, errorModel);
            })
            .finally(function () {
              vm.isLoading = false;
              $rootScope.$broadcast('loading:end');
            });
        }

        $rootScope.$on('globalRetry', function () {
          vm.refresh();
        });

        vm.init();
      }
    ]);
})();
