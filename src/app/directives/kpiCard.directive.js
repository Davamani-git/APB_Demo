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
                trend: "@",
                supportingLabel: "@"
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
        vm.iconClass = vm.icon || "fa-circle";
        vm.trendIndicator = vm.trend || "";
    }

    angular.module("app")
        .directive("kpiCard", KpiCardDirective);
})();
