(function() {
  'use strict';

  function SpendDashboardFeatureConfig() {
    // Feature-specific configuration constants
    var config = {
      maxHistoryMonths: 12,
      defaultMode: 'billing',
      chartHeight: 400,
      enableEnhancedBreakdown: false,
      showDataFreshness: true
    };

    return config;
  }

  angular.module('davms.spendDashboard')
    .constant('SpendDashboardConfig', SpendDashboardFeatureConfig());
})();