(function () {
  'use strict';

  SpendingTrendModel.$inject = ['MAX_LOOKBACK_MONTHS'];

  function SpendingTrendModel(MAX_LOOKBACK_MONTHS) {
    function create(raw) {
      var model = {
        startMonth: (raw && raw.startMonth) || '',
        endMonth: (raw && raw.endMonth) || '',
        currency: (raw && raw.currency) || 'USD',
        points: Array.isArray(raw && raw.points) ? raw.points.map(normalizePoint) : []
      };

      if (!/^\d{4}-\d{2}$/.test(model.startMonth)) {
        throw new Error('Invalid startMonth format for SpendingTrendModel');
      }
      if (!/^\d{4}-\d{2}$/.test(model.endMonth)) {
        throw new Error('Invalid endMonth format for SpendingTrendModel');
      }
      if (model.points.length > MAX_LOOKBACK_MONTHS) {
        throw new Error('SpendingTrendModel points exceed max lookback months');
      }
      model.points.forEach(function (p) {
        if (!/^\d{4}-\d{2}$/.test(p.month)) {
          throw new Error('Invalid month in SpendingTrendModel point');
        }
        if (p.totalSpend < 0 || p.transactionCount < 0) {
          throw new Error('Negative values are not allowed in SpendingTrendModel points');
        }
      });
      return model;
    }

    function normalizePoint(p) {
      return {
        month: p.month || '',
        totalSpend: normalizeNumber(p.totalSpend),
        transactionCount: normalizeInteger(p.transactionCount)
      };
    }

    function normalizeNumber(value) {
      var num = Number(value || 0);
      return num < 0 ? 0 : num;
    }

    function normalizeInteger(value) {
      var num = parseInt(value || 0, 10);
      return num < 0 ? 0 : num;
    }

    return {
      create: create
    };
  }

  angular.module('app')
    .factory('SpendingTrendModel', SpendingTrendModel);
})();
