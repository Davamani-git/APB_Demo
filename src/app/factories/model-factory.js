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
            var model = new MonthlySummaryModel();
            model.month = data.month;
            model.currency = data.currency;
            model.totalSpend = data.totalSpend;
            model.transactionCount = data.transactionCount;
            model.isFinal = !!data.isFinal;
            model.isCurrent = !!data.isCurrent;
            model.breakdownAvailable = !!data.breakdownAvailable;
            return model;
        }

        function createKpiList(dataArray) {
            var list = [];
            if (angular.isArray(dataArray)) {
                for (var i = 0; i < dataArray.length; i++) {
                    var kpiData = dataArray[i];
                    var kpi = new KpiModel();
                    kpi.id = kpiData.id;
                    kpi.label = kpiData.label;
                    kpi.value = kpiData.value;
                    kpi.unit = kpiData.unit;
                    kpi.formattedValue = kpiData.formattedValue || '';
                    list.push(kpi);
                }
            }
            return list;
        }

        function createBreakdown(data) {
            var model = new BreakdownModel();
            model.month = data.month;
            model.categories = [];
            if (angular.isArray(data.categories)) {
                for (var i = 0; i < data.categories.length; i++) {
                    var item = data.categories[i];
                    model.categories.push({
                        id: item.id,
                        label: item.label,
                        amount: item.amount,
                        percentage: item.percentage
                    });
                }
            }
            return model;
        }

        function createErrorModel(data) {
            var model = new ErrorModel();
            model.code = data.code;
            model.message = data.message;
            model.details = data.details;
            model.correlationId = data.correlationId;
            return model;
        }

        return factory;
    }
})();
