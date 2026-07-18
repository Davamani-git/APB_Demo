(function() {
  'use strict';

  SpendDashboardFeatureConfig.$inject = [];

  function SpendDashboardFeatureConfig() {
    // Feature-specific configuration for davms.spendDashboard.
    // Limits and flags are provided via ConfigService and environment JSON.
  }

  angular.module('davms.spendDashboard').config(SpendDashboardFeatureConfig);
})();
