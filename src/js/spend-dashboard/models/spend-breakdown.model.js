(function() {
  'use strict';

  function SpendBreakdownModelFactory() {
    function SpendBreakdownModel(data) {
      data = data || {};
      
      this.mode = data.mode || 'category';
      this.totalAmount = data.totalAmount || 0.0;
      this.categories = data.categories || [];
      this.hasPartialData = data.hasPartialData || false;
      
      // Validate categories
      this.categories = this.categories.map(function(cat) {
        return {
          code: cat.code || '',
          label: cat.label || '',
          amount: cat.amount || 0.0,
          percentage: cat.percentage || 0.0
        };
      });
    }

    SpendBreakdownModel.prototype.isValid = function() {
      return this.totalAmount >= 0 && 
             Array.isArray(this.categories);
    };

    SpendBreakdownModel.prototype.hasData = function() {
      return this.categories.length > 0 && this.totalAmount > 0;
    };

    SpendBreakdownModel.prototype.getCategoriesSum = function() {
      return this.categories.reduce(function(sum, cat) {
        return sum + (cat.amount || 0);
      }, 0);
    };

    return SpendBreakdownModel;
  }

  angular.module('davms.spendDashboard')
    .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();