(function() {
  'use strict';
  angular
    .module('execDashboard.config')
    .controller('ConfigController', ConfigController);

  ConfigController.$inject = ['ConfigService', 'DataStoreService', 'ThemeService', 'AuditService', 'SecurityService', 'ValidationService'];
  function ConfigController(ConfigService, DataStoreService, ThemeService, AuditService, SecurityService, ValidationService) {
    var vm = this;
    vm.config = ConfigService.getConfig();
    vm.themes = ThemeService.getAvailableThemes();

    vm.selectTheme = function(themeId) {
      vm.config.themeId = themeId;
    };

    vm.saveConfig = function() {
      vm.config.dataSourceNote = SecurityService.sanitizeText(vm.config.dataSourceNote);
      var validation = ValidationService.validateConfig(vm.config);
      if (!validation.valid) {
        return;
      }
      var selectedTheme = findTheme(vm.config.themeId);
      var contrastResult = ThemeService.validateContrast(selectedTheme);
      if (!contrastResult.valid) {
        return;
      }
      DataStoreService.setConfig(vm.config);
      ThemeService.setTheme(vm.config.themeId);
      AuditService.logEvent('THEME_CHANGE', {
        themeId: vm.config.themeId
      });
    };

    function findTheme(id) {
      for (var i = 0; i < vm.themes.length; i++) {
        if (vm.themes[i].id === id) {
          return vm.themes[i];
        }
      }
      return vm.themes[0];
    }
  }
})();
