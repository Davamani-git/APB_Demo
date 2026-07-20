(function () {
    "use strict";

    angular.module("app")
        .directive("breakdownTable", breakdownTable);

    breakdownTable.$inject = [];

    function breakdownTable() {
        return {
            restrict: "E",
            scope: {
                items: "<",
                isEmpty: "<"
            },
            templateUrl: "src/templates/monthlySummary/_breakdownTable.partial.html",
            bindToController: true,
            controllerAs: "vm",
            controller: BreakdownTableController
        };
    }

    BreakdownTableController.$inject = [];

    function BreakdownTableController() {
        var vm = this;
    }
})();
