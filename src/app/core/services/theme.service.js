(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('ThemeService', ThemeService);

  ThemeService.$inject = ['ConfigService'];
  function ThemeService(ConfigService) {
    var themes = [
      { id: 'default', name: 'Default', primary: '#337ab7', background: '#ffffff' },
      { id: 'high-contrast', name: 'High Contrast', primary: '#000000', background: '#ffffff' }
    ];
    var currentThemeId = 'default';

    this.getCurrentTheme = function() {
      return findTheme(currentThemeId) || themes[0];
    };

    this.setTheme = function(themeId) {
      currentThemeId = themeId;
    };

    this.getAvailableThemes = function() {
      return themes.slice();
    };

    this.validateContrast = function(theme) {
      var primary = theme.primary;
      var background = theme.background;
      if (!primary || !background) {
        return { valid: false, message: 'Theme colors not defined' };
      }
      return { valid: true, message: '' };
    };

    function findTheme(id) {
      for (var i = 0; i < themes.length; i++) {
        if (themes[i].id === id) {
          return themes[i];
        }
      }
      return null;
    }
  }
})();
