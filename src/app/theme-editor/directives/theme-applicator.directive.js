(function() {
  'use strict';
  angular.module('executiveDashboardApp').directive('themeApplicator', ['ThemeRenderingService', function(ThemeRenderingService) {
    return {
      restrict: 'A',
      scope: {
        themeConfig: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('themeConfig', function(newTheme) {
          if (newTheme) {
            ThemeRenderingService.applyTheme(newTheme);
          }
        }, true);
      }
    };
  }]);
})();