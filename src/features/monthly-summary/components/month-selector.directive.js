(function () {
    'use strict';

    monthSelector.$inject = [];

    function monthSelector() {
        return {
            restrict: 'E',
            scope: {
                selectedMonth: '<',
                onChange: '&'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: MonthSelectorController,
            templateUrl: 'src/features/monthly-summary/components/month-selector.template.html',
            transclude: false,
            replace: false
        };
    }

    MonthSelectorController.$inject = [];

    function MonthSelectorController() {
        var vm = this;

        vm.monthInput = vm.selectedMonth;
        vm.onMonthSelected = onMonthSelected;

        function onMonthSelected() {
            if (typeof vm.onChange === 'function') {
                vm.onChange({ month: vm.monthInput });
            }
        }
    }

    angular
        .module('app')
        .directive('monthSelector', monthSelector);
})();
