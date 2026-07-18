(function() {
  'use strict';

  function SpendBreakdownModelFactory() {
    function SpendBreakdownModel(data) {
      data = data || {};

      this.mode = data.mode || 'category';
      this.totalAmount = sanitizeNumber(data.totalAmount, 0.0);
      this.hasPartialData = !!data.hasPartialData;
      this.currencyCode = data.currencyCode || 'USD';

      var categories = Array.isArray(data.categories) ? data.categories : [];
      this.categories = categories.map(function(c) {
        var amount = sanitizeNumber(c.amount, 0.0);
        var percentage = sanitizeNumber(c.percentage, 0.0);
        if (this.totalAmount > 0 && percentage === 0) {
          percentage = (amount / this.totalAmount) * 100;
        }
        return {
          code: c.code || '',
          label: c.label || '',
          amount: amount,
          percentage: percentage
        };
      }, this);

      var sumAmount = this.categories.reduce(function(sum, cat) {
        return sum + cat.amount;
      }, 0);

      if (sumAmount > this.totalAmount) {
        this.hasPartialData = true;
      }
    }

    SpendBreakdownModel.prototype.isValid = function() {
      return this.totalAmount >= 0 && this.categories.every(function(cat) {
        return cat.amount >= 0 && cat.percentage >= 0 && cat.percentage <= 100;
      });
    };

    function sanitizeNumber(value, defaultValue) {
      if (typeof value === 'number' && !isNaN(value)) {
        return value;
      }
      if (typeof value === 'string') {
        var parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return defaultValue;
    }

    function createFromResponse(response) {
      return new SpendBreakdownModel(response || {});
    }

    return {
      createFromResponse: createFromResponse
    };
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
