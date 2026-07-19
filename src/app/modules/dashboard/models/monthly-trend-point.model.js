(function() {
  'use strict';

  function MonthlyTrendPointModel(data) {
    data = data || {};
    this.month = data.month || '';
    this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
    this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    this.isEmpty = this.transactionCount === 0 && this.totalSpend === 0;
  }

  angular.module('app')
    .factory('MonthlyTrendPointModel', function() {
      return MonthlyTrendPointModel;
    });
})();
