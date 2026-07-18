(function() {
  'use strict';

  SpendBreakdownModelFactory.$inject = [];

  function SpendBreakdownModelFactory() {
    function SpendBreakdownModel(data) {
      data = data || {};

      this.mode = data.mode || 'category';
      this.totalAmount = parseFloat(data.totalAmount) || 0.0;
      this.categories = (data.categories || []).map(function(cat) {
        return {
          code: cat.code || '',
          label: cat.label || '',
          amount: parseFloat(cat.amount) || 0.0,
          percentage: parseFloat(cat.percentage) || 0.0
        };
      });
      this.hasPartialData = data.hasPartialData || false;
    }

    SpendBreakdownModel.prototype.isValid = function() {
      return this.totalAmount >= 0 && Array.isArray(this.categories);
    };

    SpendBreakdownModel.prototype.getCategoryByCode = function(code) {
      return this.categories.find(function(cat) {
        return cat.code === code;
      });
    };

    return SpendBreakdownModel;
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();