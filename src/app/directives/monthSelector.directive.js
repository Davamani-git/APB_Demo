(function () {
    'use strict';

    MonthSelectorDirective.$inject = [];

    function MonthSelectorDirective() {
        return {
            restrict: 'E',
            scope: {
                months: '<',
                selectedMonth: '=',
                onChange: '&'
            },
            bindToController: true,
            controller: MonthSelectorController,
            controllerAs: 'vm',
            templateUrl: 'templates/dashboard/monthSelector.html'
        };
    }

    MonthSelectorController.$inject = ['$scope'];

    function MonthSelectorController($scope) {
        var vm = this;
        vm.internalSelectedMonth = vm.selectedMonth;
        vm.handleChange = handleChange;

        $scope.$watch(function () { return vm.selectedMonth; }, function (newVal) {
            vm.internalSelectedMonth = newVal;
        });

        function handleChange() {
            vm.selectedMonth = vm.internalSelectedMonth;
            if (vm.onChange) {
                vm.onChange({ month: vm.selectedMonth });
            }
        }
    }

    angular.module('app')
        .directive('monthSelector', MonthSelectorDirective);
})();
