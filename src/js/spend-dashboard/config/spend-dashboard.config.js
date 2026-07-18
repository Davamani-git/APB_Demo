(function() {
  'use strict';

  SpendDashboardFeatureConfig.$inject = []; // No injected providers defined in LLD

  function SpendDashboardFeatureConfig() {
    // Feature-specific configuration (e.g., max historical months) can be
    // applied here if needed. The LLD does not mandate specific values,
    // but reserves this config block for such use.
  }

  angular.module('davms.spendDashboard')
    .config(SpendDashboardFeatureConfig);
})();
