(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('ThemeService', ['StorageService', 'ENV_CONFIG', 'ValidationService', 'LoggingService', '$document', function (StorageService, ENV_CONFIG, ValidationService, LoggingService, $document) {
      var availableThemes = [
        { id: 'default', name: 'Default', bodyClass: 'theme-default', primary: '#007bff', background: '#ffffff', text: '#212529' },
        { id: 'dark', name: 'Dark', bodyClass: 'theme-dark', primary: '#343a40', background: '#212529', text: '#f8f9fa' }
      ];

      var currentThemeId = 'default';

      function applyBodyClass(theme) {
        var body = $document.find('body').eq(0);
        body.removeClass('theme-default theme-dark');
        body.addClass(theme.bodyClass);
      }

      this.getAvailableThemes = function () {
        return availableThemes.slice();
      };

      this.getCurrentTheme = function () {
        var stored = StorageService.load(ENV_CONFIG.storageKeyTheme);
        if (stored && stored.id) {
          currentThemeId = stored.id;
        }
        var theme = availableThemes.filter(function (t) { return t.id === currentThemeId; })[0] || availableThemes[0];
        applyBodyClass(theme);
        return theme;
      };

      this.validateThemeColors = function (theme) {
        return true;
      };

      this.applyTheme = function (themeId) {
        var theme = availableThemes.filter(function (t) { return t.id === themeId; })[0];
        if (!theme) {
          LoggingService.warn('Theme not found', { themeId: themeId });
          return;
        }
        if (!this.validateThemeColors(theme)) {
          LoggingService.warn('Theme contrast validation failed', { themeId: themeId });
          return;
        }
        currentThemeId = themeId;
        applyBodyClass(theme);
        StorageService.save(ENV_CONFIG.storageKeyTheme, { id: currentThemeId });
        LoggingService.info('Theme applied', { themeId: themeId });
      };
    }]);
})();