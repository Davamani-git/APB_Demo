(function () {
    "use strict";

    MonthSelectorDirective.$inject = [];
    MonthSelectorController.$inject = [];

    function MonthSelectorDirective() {
        return {
            restrict: "E",
            scope: {
                months: "<",
                selectedMonth: "=",
                onChange: "&"
            },
            bindToController: true,
            controller: MonthSelectorController,
            controllerAs: "vm",
            templateUrl: "templates/dashboard/monthSelector.html"
        };
    }

    function MonthSelectorController() {
        var vm = this;

        vm.$onInit = function () {
            vm.internalSelectedMonth = vm.selectedMonth;
        };

        vm.onInternalChange = function () {
            vm.selectedMonth = vm.internalSelectedMonth;
            if (vm.onChange) {
                vm.onChange({ month: vm.selectedMonth });
            }
        };
    }

    angular
        .module("app")
        .directive("monthSelector", MonthSelectorDirective);
})();
