(function () {
    "use strict";

    KpiCardDirective.$inject = [];

    function KpiCardDirective() {
        return {
            restrict: "E",
            scope: {
                label: "@",
                value: "<",
                icon: "@",
                tooltip: "@",
                supportingLabel: "@",
                trendIndicator: "@",
                currencyCode: "@"
            },
            bindToController: true,
            controller: KpiCardController,
            controllerAs: "vm",
            templateUrl: "templates/dashboard/kpiCard.html"
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;

        vm.getTrendClass = function () {
            if (vm.trendIndicator === "up") {
                return "kpi-card-trend-up";
            }
            if (vm.trendIndicator === "down") {
                return "kpi-card-trend-down";
            }
            return "kpi-card-trend-neutral";
        };
    }

    angular.module("app")
        .directive("kpiCard", KpiCardDirective);
}());
