(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('ModelFactory', ModelFactory);

  ModelFactory.$inject = [];

  function ModelFactory() {
    var factory = {
      createMonthlySummary: createMonthlySummary,
      createKpiList: createKpiList,
      createBreakdown: createBreakdown,
      createErrorModel: createErrorModel
    };

    function createMonthlySummary(data) {
      var model = {
        month: data && data.month || '',
        currency: data && data.currency || 'USD',
        totalSpend: data && typeof data.totalSpend === 'number' ? data.totalSpend : 0,
        transactionCount: data && typeof data.transactionCount === 'number' ? data.transactionCount : 0,
        isFinal: !!(data && data.isFinal),
        isCurrent: !!(data && data.isCurrent),
        breakdownAvailable: !!(data && data.breakdownAvailable)
      };
      return model;
    }

    function createKpiList(dataArray) {
      var list = [];
      if (!angular.isArray(dataArray)) {
        return list;
      }
      dataArray.forEach(function (item) {
        list.push({
          id: item.id || '',
          label: item.label || '',
          value: typeof item.value === 'number' ? item.value : 0,
          unit: item.unit || '',
          formattedValue: item.formattedValue || ''
        });
      });
      return list;
    }

    function createBreakdown(data) {
      var categories = [];
      if (data && angular.isArray(data.categories)) {
        categories = data.categories.map(function (c) {
          return {
            id: c.id || '',
            label: c.label || '',
            amount: typeof c.amount === 'number' ? c.amount : 0,
            percentage: typeof c.percentage === 'number' ? c.percentage : 0
          };
        });
      }
      var model = {
        month: data && data.month || '',
        categories: categories
      };
      return model;
    }

    function createErrorModel(data) {
      var model = {
        code: data && data.code || 'UNKNOWN',
        message: data && data.message || 'An error occurred',
        details: data && data.details || '',
        correlationId: data && data.correlationId || ''
      };
      return model;
    }

    return factory;
  }
})();
