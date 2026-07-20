(function () {
    'use strict';

    angular
        .module('app')
        .directive('budgetProgress', budgetProgress);

    function budgetProgress() {
        return {
            restrict: 'E',
            scope: {
                budget: '<'
            },
            templateUrl: 'src/templates/directives/budget-progress.html',
            controller: BudgetProgressController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    BudgetProgressController.$inject = [];

    function BudgetProgressController() {
        var vm = this;
        vm.getBarType = function() {
            if (!vm.budget or vm.budget.utilizationPercentage === null) return 'info';
            if (vm.budget.utilizationPercentage > 90) return 'danger';
            if (vm.budget.utilizationPercentage > 75) return 'warning';
            return 'success';
        };
    }
})();