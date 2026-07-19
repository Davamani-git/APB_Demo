(function () {
  'use strict';

  MonthlySummaryModel.$inject = [];

  function MonthlySummaryModel() {
    function create(raw) {
      var model = {
        month: (raw && raw.month) || '',
        totalSpend: normalizeNumber(raw && raw.totalSpend),
        transactionCount: normalizeInteger(raw && raw.transactionCount),
        averageSpend: normalizeNumber(raw && raw.averageSpend),
        currency: (raw && raw.currency) || 'USD',
        categories: Array.isArray(raw && raw.categories) ? raw.categories.map(normalizeCategory) : []
      };

      if (!/^\d{4}-\d{2}$/.test(model.month)) {
        throw new Error('Invalid month format for MonthlySummaryModel');
      }
      if (model.totalSpend < 0 || model.transactionCount < 0 || model.averageSpend < 0) {
        throw new Error('Negative values are not allowed in MonthlySummaryModel');
      }
      return model;
    }

    function normalizeNumber(value) {
      var num = Number(value || 0);
      return num < 0 ? 0 : num;
    }

    function normalizeInteger(value) {
      var num = parseInt(value || 0, 10);
      return num < 0 ? 0 : num;
    }

    function normalizeCategory(cat) {
      var normalized = {
        name: cat.name || 'Unknown',
        amount: normalizeNumber(cat.amount),
        percentage: normalizeNumber(cat.percentage)
      };
      return normalized;
    }

    return {
      create: create
    };
  }

  angular.module('app')
    .factory('MonthlySummaryModel', MonthlySummaryModel);
})();
