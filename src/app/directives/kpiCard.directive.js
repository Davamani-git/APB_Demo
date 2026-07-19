(function () {
    "use strict";

    KpiCardDirective.$inject = [];
    KpiCardController.$inject = [];

    function KpiCardDirective() {
        return {
            restrict: "E",
            scope: {
                kpi: "<"
            },
            bindToController: true,
            controller: KpiCardController,
            controllerAs: "vm",
            templateUrl: "templates/dashboard/kpiCard.html"
        };
    }

    function KpiCardController() {
        var vm = this;

        vm.$onInit = function () {
            vm.label = vm.kpi.label;
            vm.formattedValue = vm.kpi.formattedValue;
            vm.iconClass = vm.kpi.iconClass;
            vm.trendIndicator = vm.kpi.trendIndicator;
            vm.trendLabel = vm.kpi.trendLabel;
            vm.supportingLabel = vm.kpi.supportingLabel;
        };
    }

    angular
        .module("app")
        .directive("kpiCard", KpiCardDirective);
})();
