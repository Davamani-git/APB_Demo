(function () {
  'use strict';

  SpendDashboardFeatureConfig.$inject = [];

  function SpendDashboardFeatureConfig() {
    // Feature-specific static configuration for spend dashboard can be wired here
    // using constants or providers if needed. In this implementation, dynamic
    // configuration is loaded via ConfigService from env.*.json files.
  }

  angular.module('davms.spendDashboard').config(SpendDashboardFeatureConfig);
})();
