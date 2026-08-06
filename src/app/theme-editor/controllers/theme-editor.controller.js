(function() {
  'use strict';
  angular.module('executiveDashboardApp').controller('ThemeEditorController', ['$scope', 'ColorCustomizationService', 'ThemePersistenceService', 'ThemeRenderingService', 'DataStorageService', function($scope, ColorCustomizationService, ThemePersistenceService, ThemeRenderingService, DataStorageService) {
    var vm = this;
    vm.currentTheme = null;
    vm.kpiTiles = [];
    vm.scopeTiles = [];
    vm.statusColors = {};
    vm.groupColors = {};
    vm.bulkKpiColor = '#2196F3';
    vm.bulkScopeColor = '#FFFFFF';
    function init() {
      vm.currentTheme = ThemePersistenceService.loadCurrentTheme();
      loadTileData();
      loadThemeColors();
    }
    function loadTileData() {
      try {
        var kpiData = DataStorageService.getKpiData();
        vm.kpiTiles = kpiData.map(function(kpi) {
          return {
            id: kpi.id,
            title: kpi.title,
            color: vm.currentTheme.kpiTileColors[kpi.id] || '#2196F3'
          };
        });
        var scopeData = DataStorageService.getScopeData();
        vm.scopeTiles = scopeData.map(function(scope) {
          return {
            scopeId: scope.scopeId,
            scopeName: scope.scopeName,
            color: vm.currentTheme.testingScopeTileColors[scope.scopeId] || '#FFFFFF'
          };
        });
      } catch(e) {
        console.error('Error loading tile data:', e);
      }
    }
    function loadThemeColors() {
      vm.statusColors = {
        inProgress: vm.currentTheme.statusColors.inProgress || '#4CAF50',
        designInProgress: vm.currentTheme.statusColors.designInProgress || '#FFC107'
      };
      vm.groupColors = {
        inProgress: vm.currentTheme.groupBackgroundColors.inProgress || '#E8F5E9',
        designInProgress: vm.currentTheme.groupBackgroundColors.designInProgress || '#FFF3E0'
      };
    }
    vm.updateKpiColor = function(kpiId, color) {
      try {
        vm.currentTheme = ColorCustomizationService.applyColorToTile('kpi-' + kpiId, color, vm.currentTheme);
        vm.currentTheme.kpiTileColors[kpiId] = color;
      } catch(e) {
        console.error('Error updating KPI color:', e);
      }
    };
    vm.updateScopeColor = function(scopeId, color) {
      try {
        vm.currentTheme = ColorCustomizationService.applyColorToTile(scopeId, color, vm.currentTheme);
        vm.currentTheme.testingScopeTileColors[scopeId] = color;
      } catch(e) {
        console.error('Error updating scope color:', e);
      }
    };
    vm.updateStatusColor = function(status, color) {
      try {
        vm.currentTheme = ColorCustomizationService.applyStatusColor(status, color, vm.currentTheme);
      } catch(e) {
        console.error('Error updating status color:', e);
      }
    };
    vm.updateGroupColor = function(groupName, color) {
      try {
        vm.currentTheme = ColorCustomizationService.applyGroupColor(groupName, color, vm.currentTheme);
      } catch(e) {
        console.error('Error updating group color:', e);
      }
    };
    vm.applyBulkKpiColor = function() {
      try {
        vm.kpiTiles.forEach(function(kpi) {
          kpi.color = vm.bulkKpiColor;
          vm.currentTheme.kpiTileColors[kpi.id] = vm.bulkKpiColor;
        });
      } catch(e) {
        console.error('Error applying bulk KPI color:', e);
      }
    };
    vm.applyBulkScopeColor = function() {
      try {
        vm.scopeTiles.forEach(function(scope) {
          scope.color = vm.bulkScopeColor;
          vm.currentTheme.testingScopeTileColors[scope.scopeId] = vm.bulkScopeColor;
        });
      } catch(e) {
        console.error('Error applying bulk scope color:', e);
      }
    };
    vm.saveTheme = function() {
      try {
        ThemePersistenceService.persistTheme(vm.currentTheme);
        ThemeRenderingService.applyTheme(vm.currentTheme);
        alert('Theme saved successfully!');
      } catch(e) {
        console.error('Error saving theme:', e);
        alert('Error saving theme. Please try again.');
      }
    };
    vm.resetTheme = function() {
      try {
        if (confirm('Are you sure you want to reset to default theme?')) {
          ThemePersistenceService.resetTheme();
          vm.currentTheme = ThemePersistenceService.loadCurrentTheme();
          loadTileData();
          loadThemeColors();
          ThemeRenderingService.applyTheme(vm.currentTheme);
          alert('Theme reset to default!');
        }
      } catch(e) {
        console.error('Error resetting theme:', e);
        alert('Error resetting theme. Please try again.');
      }
    };
    init();
  }]);
})();