(function () {
    'use strict';

    angular
        .module('app')
        .directive('transactionsTable', transactionsTable);

    function transactionsTable() {
        return {
            restrict: 'E',
            scope: {
                transactions: '<',
                totalCount: '<',
                filters: '<',
                onPageChange: '&',
                onSortChange: '&',
                isCompact: '<' // For recent transactions widget
            },
            templateUrl: 'src/templates/directives/transactions-table.html',
            controller: TransactionsTableController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    TransactionsTableController.$inject = [];

    function TransactionsTableController() {
        var vm = this;

        vm.handlePageChange = function() {
            if (vm.onPageChange) {
                vm.onPageChange({ page: vm.filters.page });
            }
        };

        vm.handleSort = function(field) {
            if (vm.onSortChange) {
                vm.onSortChange({ field: field });
            }
        };
    }
})();