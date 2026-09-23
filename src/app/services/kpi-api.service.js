(function() {
  'use strict';
  angular.module('creditDashboardApp').service('KpiApiService', ['$http', '$q', 'ApiConfigFactory', function($http, $q, ApiConfigFactory) {
    this.getKpiSummary = function(userId, month) {
      var deferred = $q.defer();
      var mockKpi = {
        month: month || '2025-02',
        totalMonthlySpend: 13400,
        totalCreditLimit: 225000,
        totalAvailableCredit: 180000,
        totalOutstandingAmount: 45000,
        cardCount: 3
      };
      setTimeout(function() {
        deferred.resolve(mockKpi);
      }, 200);
      return deferred.promise;
    };
  }]);
  angular.module('creditDashboardApp').service('KpiApiService').$inject = ['$http', '$q', 'ApiConfigFactory'];
})();