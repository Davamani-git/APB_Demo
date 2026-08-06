(function() {
  'use strict';
  angular.module('executiveDashboardApp').directive('kpiTile', ['ThemePersistenceService', function(ThemePersistenceService) {
    return {
      restrict: 'A',
      scope: {
        kpiData: '='
      },
      template: '<div class="kpi-tile" ng-style="tileStyle"><div class="kpi-title">{{kpiData.title}}</div><div class="kpi-value">{{kpiData.completed}}/{{kpiData.total}}</div><div class="kpi-unit">{{kpiData.percentage}}% Complete</div></div>',
      link: function(scope, element, attrs) {
        var theme = ThemePersistenceService.loadCurrentTheme();
        scope.tileStyle = {};
        if (theme && theme.kpiTileColors && theme.kpiTileColors[scope.kpiData.id]) {
          scope.tileStyle = {'background-color': theme.kpiTileColors[scope.kpiData.id]};
        } else {
          var defaultColors = {
            'testingUseCases': '#2196F3',
            'agents': '#4CAF50',
            'workflows': '#FF9800',
            'apbFlows': '#9C27B0'
          };
          scope.tileStyle = {'background-color': defaultColors[scope.kpiData.id] || '#2196F3'};
        }
        scope.$on('theme:changed', function(event, themeConfig) {
          if (themeConfig && themeConfig.kpiTileColors && themeConfig.kpiTileColors[scope.kpiData.id]) {
            scope.tileStyle = {'background-color': themeConfig.kpiTileColors[scope.kpiData.id]};
          }
        });
      }
    };
  }]);
})();