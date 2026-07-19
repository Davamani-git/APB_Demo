(function() {
  'use strict';

  MonthlyTrendPointModel.$inject = [];

  function MonthlyTrendPointModel() {}

  MonthlyTrendPointModel.prototype.fromResponse = function(data) {
    if (!data) {
      return this;
    }

    this.month = typeof data.month === 'string' ? data.month : '';
    this.totalSpend = typeof data.totalSpend === 'number' && data.totalSpend >= 0 ? data.totalSpend : 0;
    this.transactionCount = typeof data.transactionCount === 'number' && data.transactionCount >= 0 ? data.transactionCount : 0;
    this.isEmpty = this.transactionCount === 0 && this.totalSpend === 0;

    return this;
  };

  angular.module('app')
    .factory('MonthlyTrendPointModel', function() {
      return MonthlyTrendPointModel;
    });
})();
