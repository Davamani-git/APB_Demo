(function() {
  'use strict';
  angular.module('executiveDashboardApp').controller('StatusManagerController', ['$scope', '$filter', 'StatusManagementService', 'DataStorageService', 'ThemePersistenceService', 'ThemeRenderingService', function($scope, $filter, StatusManagementService, DataStorageService, ThemePersistenceService, ThemeRenderingService) {
    var vm = this;
    vm.allScopes = [];
    vm.inProgressScopes = [];
    vm.designInProgressScopes = [];
    vm.currentTheme = null;
    function init() {
      vm.currentTheme = ThemePersistenceService.loadCurrentTheme();
      loadScopeData();
    }
    function loadScopeData() {
      try {
        vm.allScopes = DataStorageService.getScopeData();
        groupScopes();
      } catch(e) {
        console.error('Error loading scope data:', e);
        vm.allScopes = [];
      }
    }
    function groupScopes() {
      vm.inProgressScopes = vm.allScopes.filter(function(scope) {
        return scope.status === 'In Progress';
      });
      vm.designInProgressScopes = vm.allScopes.filter(function(scope) {
        return scope.status === 'Design in Progress';
      });
    }
    vm.getScopeTileStyle = function(scopeId) {
      return ThemeRenderingService.getScopeTileStyle(scopeId, vm.currentTheme);
    };
    $scope.$on('theme:changed', function(event, themeConfig) {
      vm.currentTheme = themeConfig;
    });
    $scope.$on('data:updated', function() {
      loadScopeData();
    });
    init();
  }]);
})();