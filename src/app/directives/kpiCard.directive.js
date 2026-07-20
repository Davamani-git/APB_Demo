(function () {
    "use strict";

    angular.module("app")
        .directive("kpiCard", kpiCard);

    kpiCard.$inject = [];

    function kpiCard() {
        return {
            restrict: "E",
            scope: {
                kpi: "<"
            },
            templateUrl: "src/templates/monthlySummary/_kpiCards.partial.html",
            bindToController: true,
            controllerAs: "vm",
            controller: KpiCardController
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;
    }
})();
