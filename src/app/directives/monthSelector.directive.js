(function () {
    "use strict";

    angular.module("app")
        .directive("monthSelector", monthSelector);

    monthSelector.$inject = [];

    function monthSelector() {
        return {
            restrict: "E",
            scope: {
                selectedMonth: "=",
                onChange: "&"
            },
            templateUrl: "src/templates/monthlySummary/_monthSelector.partial.html",
            bindToController: true,
            controllerAs: "vm",
            controller: MonthSelectorController
        };
    }

    MonthSelectorController.$inject = ["ENV_CONFIG"];

    function MonthSelectorController(ENV_CONFIG) {
        var vm = this;

        vm.availableMonths = buildAvailableMonths();
        vm.internalSelectedMonth = vm.selectedMonth;
        vm.changeMonth = changeMonth;

        function buildAvailableMonths() {
            var months = [];
            var now = new Date();
            for (var i = 0; i < ENV_CONFIG.maxLookbackMonths; i++) {
                var date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                var year = date.getFullYear();
                var monthIndex = date.getMonth() + 1;
                var monthString = monthIndex < 10 ? "0" + monthIndex : "" + monthIndex;
                var value = year + "-" + monthString;
                months.push({
                    value: value,
                    label: value
                });
            }
            return months;
        }

        function changeMonth() {
            vm.selectedMonth = vm.internalSelectedMonth;
            vm.onChange({ month: vm.internalSelectedMonth });
        }
    }
})();
