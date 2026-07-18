(function() {
  'use strict';

  SpendBreakdownModelFactory.$inject = [];

  function SpendBreakdownModelFactory() {
    function SpendBreakdownModel(raw) {
      raw = raw || {};

      this.mode = raw.mode || 'category';
      var totalAmount = typeof raw.totalAmount === 'number' ? raw.totalAmount : 0.0;
      this.totalAmount = totalAmount;
      this.hasPartialData = typeof raw.hasPartialData === 'boolean' ? raw.hasPartialData : false;

      var categories = Array.isArray(raw.categories) ? raw.categories : [];
      this.categories = categories.map(function(c) {
        var amount = typeof c.amount === 'number' ? c.amount : 0.0;
        var percentage;
        if (totalAmount > 0 && amount >= 0) {
          percentage = (amount / totalAmount) * 100;
        } else {
          percentage = 0;
        }
        return {
          code: c.code || '',
          label: c.label || '',
          amount: amount,
          percentage: typeof c.percentage === 'number' ? c.percentage : percentage
        };
      });

      validate(this);
    }

    function validate(model) {
      var sum = 0;
      model.categories.forEach(function(c) {
        if (c.amount < 0) {
          c.amount = 0.0;
        }
        if (c.percentage < 0) {
          c.percentage = 0.0;
        }
        if (c.percentage > 100) {
          c.percentage = 100.0;
        }
        sum += c.amount;
      });
      if (sum > model.totalAmount && model.totalAmount > 0) {
        model.totalAmount = sum;
      }
    }

    return function(raw) {
      return new SpendBreakdownModel(raw);
    };
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
