(function () {
    "use strict";

    MonthSelectorDirective.$inject = [];

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

    MonthSelectorController.$inject = [];

    function MonthSelectorController() {
        var vm = this;

        vm.$onInit = function () {
            vm.internalSelectedMonth = vm.selectedMonth;
        };

        vm.$onChanges = function (changes) {
            if (changes.selectedMonth) {
                vm.internalSelectedMonth = vm.selectedMonth;
            }
        };

        vm.onInternalChange = function () {
            vm.selectedMonth = vm.internalSelectedMonth;
            if (vm.onChange) {
                vm.onChange({ month: vm.selectedMonth });
            }
        };
    }

    angular.module("app")
        .directive("monthSelector", MonthSelectorDirective);
})();
