(function () {
  'use strict';

  angular
    .module('execSummary.controllers')
    .controller('ExecSummaryDashboardController', [
      'ScopeDataService',
      'KpiCalculationService',
      'ThemeService',
      'LoggingService',
      'ErrorHandlingService',
      'AccessControlService',
      '$uibModal',
      '$scope',
      function (ScopeDataService, KpiCalculationService, ThemeService, LoggingService, ErrorHandlingService, AccessControlService, $uibModal, $scope) {
        var vm = this;

        vm.scopes = [];
        vm.kpis = {};
        vm.readinessGroups = [];
        vm.notifications = [];
        vm.role = AccessControlService.getCurrentRole();

        vm.init = function () {
          try {
            vm.scopes = ScopeDataService.loadFromStorage();
            computeKpis();
            ThemeService.getCurrentTheme();
          } catch (e) {
            ErrorHandlingService.handleUnexpectedError(e);
          }
        };

        function computeKpis() {
          var result = KpiCalculationService.computeAll(vm.scopes);
          vm.scopes = result.scopesWithMetrics;
          vm.kpis = result.kpiSummary;
          vm.readinessGroups = result.readinessGroups;
        }

        vm.refreshData = function () {
          vm.scopes = ScopeDataService.loadFromStorage();
          computeKpis();
        };

        vm.openEditor = function (scopeId) {
          if (!AccessControlService.canEditScope(scopeId)) {
            return;
          }
          var scope = ScopeDataService.getScopeById(scopeId);
          if (!scope) {
            return;
          }
          var modalInstance = $uibModal.open({
            templateUrl: 'src/app/views/data-editor-modal.html',
            controller: 'DataEditorController',
            controllerAs: 'vm',
            resolve: {
              scope: function () {
                return angular.copy(scope);
              }
            }
          });

          modalInstance.result.then(function (updatedScope) {
            var result = ScopeDataService.updateScope(updatedScope);
            if (!result.valid) {
              ErrorHandlingService.handleValidationError(result.errors, 'scope');
            } else {
              computeKpis();
            }
          }, function () {
          });
        };

        vm.applyTheme = function (themeId) {
          ThemeService.applyTheme(themeId);
        };

        vm.resetDashboard = function () {
          ScopeDataService.resetToDefaults();
          vm.scopes = ScopeDataService.getAllScopes();
          computeKpis();
        };

        vm.openThemeSettings = function () {
          $uibModal.open({
            templateUrl: 'src/app/views/theme-settings.html',
            controller: 'ThemeController',
            controllerAs: 'vm'
          });
        };

        $scope.$on('execSummary:dataUpdated', function () {
          vm.scopes = ScopeDataService.getAllScopes();
          computeKpis();
        });

        $scope.$on('execSummary:notificationsChanged', function (event, notifications) {
          vm.notifications = notifications;
        });

        vm.init();
      }
    ]);
})();