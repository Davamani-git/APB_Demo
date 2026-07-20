(function () {
  'use strict';

  angular
    .module('apbDemo')
    .factory('ModelFactory', ModelFactory);

  ModelFactory.$inject = ['MonthlySummaryModel', 'KpiModel', 'BreakdownModel', 'ErrorModel'];
  function ModelFactory(MonthlySummaryModel, KpiModel, BreakdownModel, ErrorModel) {
    return {
      createMonthlySummary: createMonthlySummary,
      createKpiList: createKpiList,
      createBreakdown: createBreakdown,
      createErrorModel: createErrorModel
    };

    function createMonthlySummary(data) {
      return new MonthlySummaryModel(data);
    }

    function createKpiList(dataArray) {
      var list = [];
      if (Array.isArray(dataArray)) {
        dataArray.forEach(function (item) {
          list.push(new KpiModel(item));
        });
      }
      return list;
    }

    function createBreakdown(data) {
      return new BreakdownModel(data);
    }

    function createErrorModel(data) {
      return new ErrorModel(data);
    }
  }
})();
