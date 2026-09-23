(function() {
  'use strict';
  angular.module('creditDashboardApp').service('KpiService', ['KpiApiService', 'KpiAggregationService', '$q', function(KpiApiService, KpiAggregationService, $q) {
    this.getKpis = function(userId, selectedMonth) {
      return KpiAggregationService.aggregateKpis(userId, selectedMonth);
    };
  }]);
  angular.module('creditDashboardApp').service('KpiService').$inject = ['KpiApiService', 'KpiAggregationService', '$q'];
})();