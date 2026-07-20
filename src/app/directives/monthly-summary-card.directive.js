(function () {
    'use strict';

    angular.module('apbDemo')
        .directive('monthlySummaryCard', monthlySummaryCard);

    monthlySummaryCard.$inject = [];

    function monthlySummaryCard() {
        return {
            restrict: 'E',
            scope: {
                summary: '<'
            },
            templateUrl: 'templates/components/monthly-summary-card.html',
            controller: MonthlySummaryCardController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    MonthlySummaryCardController.$inject = [];

    function MonthlySummaryCardController() {
        var vm = this;
        vm.getMonthLabel = function () {
            return vm.summary && vm.summary.month ? vm.summary.month : '';
        };
    }
})();
