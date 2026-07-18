(function () {
  'use strict';

  function SpendBreakdownModel(data) {
    var self = this;

    data = data || {};

    self.mode = data.mode || 'category';
    var totalAmount = typeof data.totalAmount === 'number' ? data.totalAmount : 0.0;
    self.totalAmount = totalAmount;

    var categories = Array.isArray(data.categories) ? data.categories : [];

    self.categories = categories.map(function (c) {
      var amount = typeof c.amount === 'number' ? c.amount : 0.0;
      var percentage;
      if (totalAmount > 0 && amount >= 0) {
        percentage = (amount / totalAmount) * 100;
      } else {
        percentage = typeof c.percentage === 'number' ? c.percentage : 0.0;
      }

      if (percentage < 0) {
        percentage = 0;
      }
      if (percentage > 100) {
        percentage = 100;
      }

      return {
        code: c.code || '',
        label: c.label || '',
        amount: amount,
        percentage: percentage
      };
    });

    self.hasPartialData = typeof data.hasPartialData === 'boolean' ? data.hasPartialData : false;
  }

  function SpendBreakdownModelFactory() {
    return {
      create: function (data) {
        return new SpendBreakdownModel(data);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
