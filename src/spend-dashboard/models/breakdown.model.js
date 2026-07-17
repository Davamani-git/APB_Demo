(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .factory('BreakdownModel', BreakdownModelFactory);

  function BreakdownModelFactory() {
    function BreakdownModel(data) {
      data = data || {};
      this.label = data.label || '';
      this.amount = Number(data.amount || 0);
      this.percentage = Number(data.percentage || 0);
    }

    return BreakdownModel;
  }
})();
