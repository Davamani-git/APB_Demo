(function() {
  'use strict';

  SpendDashboardFeatureConfig.$inject = [];

  function SpendDashboardFeatureConfig() {
    var config = {
      maxHistoricalMonths: 12,
      defaultMode: 'billing',
      chartType: 'doughnut',
      enableTiles: true
    };

    return config;
  }

  angular.module('davms.spendDashboard')
    .constant('SpendDashboardFeatureConfig', SpendDashboardFeatureConfig());
})();