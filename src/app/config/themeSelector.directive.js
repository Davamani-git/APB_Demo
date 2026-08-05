(function() {
  'use strict';
  angular
    .module('execDashboard.config')
    .directive('themeSelector', themeSelector);

  function themeSelector() {
    return {
      restrict: 'E',
      scope: {
        themes: '=',
        selectedTheme: '=',
        onSelect: '&'
      },
      templateUrl: 'src/app/config/views/theme-selector.html'
    };
  }
})();
