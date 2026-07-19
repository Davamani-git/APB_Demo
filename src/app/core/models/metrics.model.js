(function () {
  'use strict';

  MetricsModelFactory.$inject = [];

  angular
    .module('app')
    .factory('MetricsModel', MetricsModelFactory);

  function MetricsModelFactory() {
    function MetricsModel(props) {
      var p = props || {};

      this.totalSpend = typeof p.totalSpend === 'number' && p.totalSpend >= 0 ? p.totalSpend : 0;
      this.transactionCount = Number.isInteger(p.transactionCount) && p.transactionCount >= 0 ? p.transactionCount : 0;
      this.averageTransactionAmount = typeof p.averageTransactionAmount === 'number' && p.averageTransactionAmount >= 0
        ? p.averageTransactionAmount
        : 0;
      this.activeDaysCount = Number.isInteger(p.activeDaysCount) && p.activeDaysCount >= 0 ? p.activeDaysCount : 0;
    }

    return MetricsModel;
  }
})();
