(function() {
  'use strict';

  SpendDashboardFeatureConfig.$inject = [];

  function SpendDashboardFeatureConfig() {
    // Feature-specific static configuration for QE-3179.
    // Limits and defaults are consumed by MonthSelectionService and controller.
  }

  angular.module('davms.spendDashboard').config(SpendDashboardFeatureConfig);
})();
