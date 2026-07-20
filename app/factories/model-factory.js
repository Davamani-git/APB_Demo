(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('ModelFactory', ModelFactory);

  ModelFactory.$inject = [];

  function ModelFactory() {
    return {
      createMonthlySummary: createMonthlySummary,
      createKpiList: createKpiList,
      createBreakdown: createBreakdown,
      createErrorModel: createErrorModel
    };

    function createMonthlySummary(data) {
      var model = {
        month: data.month || '',
        currency: data.currency || '',
        totalSpend: typeof data.totalSpend === 'number' ? data.totalSpend : 0,
        transactionCount: typeof data.transactionCount === 'number' ? data.transactionCount : 0,
        isFinal: !!data.isFinal,
        isCurrent: !!data.isCurrent,
        breakdownAvailable: !!data.breakdownAvailable
      };
      return model;
    }

    function createKpiList(dataArray) {
      var list = [];
      angular.forEach(dataArray, function (item) {
        var model = {
          id: item.id || '',
          label: item.label || '',
          value: typeof item.value === 'number' ? item.value : 0,
          unit: item.unit || '',
          formattedValue: item.formattedValue || ''
        };
        list.push(model);
      });
      return list;
    }

    function createBreakdown(data) {
      var model = {
        month: data.month || '',
        categories: []
      };
      if (angular.isArray(data.categories)) {
        angular.forEach(data.categories, function (item) {
          var categoryModel = {
            id: item.id || '',
            label: item.label || '',
            amount: typeof item.amount === 'number' ? item.amount : 0,
            percentage: typeof item.percentage === 'number' ? item.percentage : 0
          };
          model.categories.push(categoryModel);
        });
      }
      return model;
    }

    function createErrorModel(data) {
      return {
        code: data.code || null,
        message: data.message || 'An error occurred.',
        details: data.details || '',
        correlationId: data.correlationId || null
      };
    }
  }
})();
