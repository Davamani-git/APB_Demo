(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('ThemePersistenceService', ['LocalStorageFactory', function(LocalStorageFactory) {
    this.loadCurrentTheme = function() {
      try {
        var theme = LocalStorageFactory.retrieve('dashboardTheme');
        if (!theme) {
          theme = this.getDefaultTheme();
          this.persistTheme(theme);
        }
        return theme;
      } catch(e) {
        console.error('Error loading current theme:', e);
        return this.getDefaultTheme();
      }
    };
    this.persistTheme = function(themeConfig) {
      try {
        themeConfig.lastUpdated = new Date();
        return LocalStorageFactory.store('dashboardTheme', themeConfig);
      } catch(e) {
        console.error('Error persisting theme:', e);
        return false;
      }
    };
    this.resetTheme = function() {
      try {
        var defaultTheme = this.getDefaultTheme();
        return this.persistTheme(defaultTheme);
      } catch(e) {
        console.error('Error resetting theme:', e);
        return false;
      }
    };
    this.getDefaultTheme = function() {
      return {
        themeId: 'default',
        themeName: 'Default Theme',
        createdDate: new Date(),
        kpiTileColors: {
          'testingUseCases': '#2196F3',
          'agents': '#4CAF50',
          'workflows': '#FF9800',
          'apbFlows': '#9C27B0'
        },
        testingScopeTileColors: {},
        statusColors: {
          'inProgress': '#4CAF50',
          'designInProgress': '#FFC107'
        },
        groupBackgroundColors: {
          'inProgress': '#E8F5E9',
          'designInProgress': '#FFF3E0'
        },
        isActive: true
      };
    };
  }]);
})();