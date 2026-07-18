(function() {
  'use strict';

  function SpendBreakdownModelFactory() {
    function SpendBreakdownModel(raw) {
      raw = raw || {};

      this.mode = typeof raw.mode === 'string' ? raw.mode : 'category';
      var totalAmount = typeof raw.totalAmount === 'number' ? raw.totalAmount : 0.0;
      if (totalAmount < 0) {
        totalAmount = 0.0;
      }
      this.totalAmount = totalAmount;

      this.hasPartialData = typeof raw.hasPartialData === 'boolean' ? raw.hasPartialData : false;

      var categories = Array.isArray(raw.categories) ? raw.categories : [];
      var normalizedCategories = [];
      var sumAmounts = 0.0;

      for (var i = 0; i < categories.length; i++) {
        var c = categories[i] || {};
        var amount = typeof c.amount === 'number' ? c.amount : 0.0;
        if (amount < 0) {
          amount = 0.0;
        }
        sumAmounts += amount;
        var percentage;
        if (this.totalAmount > 0) {
          percentage = (amount / this.totalAmount) * 100;
        } else {
          percentage = 0.0;
        }
        if (percentage < 0) {
          percentage = 0.0;
        }
        if (percentage > 100) {
          percentage = 100.0;
        }
        normalizedCategories.push({
          code: typeof c.code === 'string' ? c.code : '',
          label: typeof c.label === 'string' ? c.label : '',
          amount: amount,
          percentage: percentage
        });
      }

      if (sumAmounts > this.totalAmount) {
        this.hasPartialData = true;
      }

      this.categories = normalizedCategories;
    }

    return function(raw) {
      return new SpendBreakdownModel(raw);
    };
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
