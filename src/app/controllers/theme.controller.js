(function () {
  'use strict';

  angular
    .module('execSummary.controllers')
    .controller('ThemeController', [
      'ThemeService',
      'LoggingService',
      function (ThemeService, LoggingService) {
        var vm = this;

        vm.themes = [];
        vm.selectedThemeId = null;

        vm.loadThemes = function () {
          vm.themes = ThemeService.getAvailableThemes();
          var current = ThemeService.getCurrentTheme();
          vm.selectedThemeId = current.id;
        };

        vm.selectTheme = function (themeId) {
          vm.selectedThemeId = themeId;
          ThemeService.applyTheme(themeId);
          LoggingService.info('Theme selected', { themeId: themeId });
        };

        vm.loadThemes();
      }
    ]);
})();