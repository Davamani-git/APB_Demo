(function() {
  'use strict';

  SpendBreakdownModelFactory.$inject = [];

  function SpendBreakdownModelFactory() {
    function SpendBreakdownModel(raw) {
      raw = raw || {};

      this.mode = raw.mode || 'category';
      this.totalAmount = typeof raw.totalAmount === 'number' ? raw.totalAmount : 0.0;
      this.categories = Array.isArray(raw.categories) ? raw.categories.map(function(cat) {
        return {
          code: cat.code || '',
          label: cat.label || '',
          amount: typeof cat.amount === 'number' ? cat.amount : 0.0,
          percentage: typeof cat.percentage === 'number'
            ? cat.percentage
            : (this.totalAmount > 0 ? (cat.amount || 0) / this.totalAmount * 100 : 0.0)
        };
      }, this) : [];
      this.hasPartialData = !!raw.hasPartialData;
    }

    SpendBreakdownModel.prototype.hasData = function() {
      return this.totalAmount > 0 && this.categories.length > 0;
    };

    return function(raw) {
      return new SpendBreakdownModel(raw);
    };
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
