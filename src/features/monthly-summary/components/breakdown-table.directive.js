(function () {
    'use strict';

    breakdownTable.$inject = [];

    function breakdownTable() {
        return {
            restrict: 'E',
            scope: {
                breakdown: '<',
                currencyCode: '@'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: BreakdownTableController,
            templateUrl: 'src/features/monthly-summary/components/breakdown-table.template.html',
            transclude: false,
            replace: false
        };
    }

    BreakdownTableController.$inject = [];

    function BreakdownTableController() {
        var vm = this;
    }

    angular
        .module('app')
        .directive('breakdownTable', breakdownTable);
})();
