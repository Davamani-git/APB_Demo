(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('ThemeRenderingService', ['$rootScope', function($rootScope) {
    this.applyTheme = function(themeConfig) {
      try {
        $rootScope.$broadcast('theme:changed', themeConfig);
        return true;
      } catch(e) {
        console.error('Error applying theme:', e);
        return false;
      }
    };
    this.getKpiTileStyle = function(kpiId, themeConfig) {
      try {
        if (themeConfig && themeConfig.kpiTileColors && themeConfig.kpiTileColors[kpiId]) {
          return {'background-color': themeConfig.kpiTileColors[kpiId]};
        }
        return {};
      } catch(e) {
        console.error('Error getting KPI tile style:', e);
        return {};
      }
    };
    this.getScopeTileStyle = function(scopeId, themeConfig) {
      try {
        if (themeConfig && themeConfig.testingScopeTileColors && themeConfig.testingScopeTileColors[scopeId]) {
          return {'background-color': themeConfig.testingScopeTileColors[scopeId]};
        }
        return {};
      } catch(e) {
        console.error('Error getting scope tile style:', e);
        return {};
      }
    };
    this.getStatusStyle = function(status, themeConfig) {
      try {
        if (themeConfig && themeConfig.statusColors && themeConfig.statusColors[status]) {
          return {'background-color': themeConfig.statusColors[status]};
        }
        return {};
      } catch(e) {
        console.error('Error getting status style:', e);
        return {};
      }
    };
    this.getGroupStyle = function(groupName, themeConfig) {
      try {
        if (themeConfig && themeConfig.groupBackgroundColors && themeConfig.groupBackgroundColors[groupName]) {
          return {'background-color': themeConfig.groupBackgroundColors[groupName]};
        }
        return {};
      } catch(e) {
        console.error('Error getting group style:', e);
        return {};
      }
    };
  }]);
})();