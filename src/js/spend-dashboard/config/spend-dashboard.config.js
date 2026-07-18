(function() {
  'use strict';

  SpendDashboardFeatureConfig.$inject = [];

  function SpendDashboardFeatureConfig() {
    // Feature-level configuration for QE-3179 / DAVMS dashboard.
    // For now this is a placeholder; if using a provider pattern, it would be wired here.
  }

  angular.module('davms.spendDashboard')
    .config(SpendDashboardFeatureConfig);
})();
