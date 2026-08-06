(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('ColorCustomizationService', ['ThemeRenderingService', function(ThemeRenderingService) {
    this.applyColorToTile = function(tileId, colorHex, themeConfig) {
      try {
        if (!themeConfig.kpiTileColors) themeConfig.kpiTileColors = {};
        if (!themeConfig.testingScopeTileColors) themeConfig.testingScopeTileColors = {};
        if (tileId.startsWith('kpi-')) {
          themeConfig.kpiTileColors[tileId] = colorHex;
        } else {
          themeConfig.testingScopeTileColors[tileId] = colorHex;
        }
        return themeConfig;
      } catch(e) {
        console.error('Error applying color to tile:', e);
        return themeConfig;
      }
    };
    this.applyBulkColor = function(tileType, colorHex, themeConfig) {
      try {
        if (tileType === 'kpi') {
          if (!themeConfig.kpiTileColors) themeConfig.kpiTileColors = {};
          Object.keys(themeConfig.kpiTileColors).forEach(function(key) {
            themeConfig.kpiTileColors[key] = colorHex;
          });
        } else if (tileType === 'scope') {
          if (!themeConfig.testingScopeTileColors) themeConfig.testingScopeTileColors = {};
          Object.keys(themeConfig.testingScopeTileColors).forEach(function(key) {
            themeConfig.testingScopeTileColors[key] = colorHex;
          });
        }
        return themeConfig;
      } catch(e) {
        console.error('Error applying bulk color:', e);
        return themeConfig;
      }
    };
    this.applyStatusColor = function(status, colorHex, themeConfig) {
      try {
        if (!themeConfig.statusColors) themeConfig.statusColors = {};
        themeConfig.statusColors[status] = colorHex;
        return themeConfig;
      } catch(e) {
        console.error('Error applying status color:', e);
        return themeConfig;
      }
    };
    this.applyGroupColor = function(groupName, colorHex, themeConfig) {
      try {
        if (!themeConfig.groupBackgroundColors) themeConfig.groupBackgroundColors = {};
        themeConfig.groupBackgroundColors[groupName] = colorHex;
        return themeConfig;
      } catch(e) {
        console.error('Error applying group color:', e);
        return themeConfig;
      }
    };
  }]);
})();