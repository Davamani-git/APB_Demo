(function() {
  'use strict';
  angular.module('executiveDashboardApp').controller('KpiDisplayController', ['$scope', 'ProgressTrackingService', 'CalculationService', 'ThemePersistenceService', 'ThemeRenderingService', function($scope, ProgressTrackingService, CalculationService, ThemePersistenceService, ThemeRenderingService) {
    var vm = this;
    vm.kpiTiles = [];
    vm.currentTheme = null;
    function init() {
      vm.currentTheme = ThemePersistenceService.loadCurrentTheme();
      loadKpiData();
    }
    function loadKpiData() {
      try {
        var progressData = ProgressTrackingService.getProgressData();
        vm.kpiTiles = progressData.kpis.map(function(kpi) {
          return {
            id: kpi.id,
            title: kpi.title,
            completed: kpi.completed,
            total: kpi.total,
            percentage: CalculationService.calculatePercentage(kpi.completed, kpi.total),
            unit: kpi.unit || 'items'
          };
        });
      } catch(e) {
        console.error('Error loading KPI data:', e);
        vm.kpiTiles = [];
      }
    }
    vm.getKpiTileStyle = function(kpiId) {
      return ThemeRenderingService.getKpiTileStyle(kpiId, vm.currentTheme);
    };
    $scope.$on('theme:changed', function(event, themeConfig) {
      vm.currentTheme = themeConfig;
    });
    $scope.$on('data:updated', function() {
      loadKpiData();
    });
    init();
  }]);
})();