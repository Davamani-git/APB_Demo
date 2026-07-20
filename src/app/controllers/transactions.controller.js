(function () {
    'use strict';

    angular
        .module('app')
        .controller('TransactionsController', TransactionsController);

    TransactionsController.$inject = ['TransactionsService', 'LoggingService', 'ErrorHandlerService'];

    function TransactionsController(TransactionsService, LoggingService, ErrorHandlerService) {
        var vm = this;

        vm.filters = {
            merchant: '',
            category: '',
            bank: '',
            cardId: '',
            dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            dateTo: new Date(),
            sortBy: 'date',
            sortDirection: 'desc',
            page: 1,
            pageSize: 10
        };

        vm.transactions = [];
        vm.totalCount = 0;
        vm.isLoading = false;
        vm.error = null;

        vm.search = search;
        vm.changePage = changePage;
        vm.sortBy = sortBy;

        activate();

        function activate() {
            LoggingService.info('TransactionsController activated');
            search();
        }

        function search() {
            vm.isLoading = true;
            vm.error = null;
            TransactionsService.searchTransactions(vm.filters)
                .then(function (result) {
                    vm.transactions = result.items;
                    vm.totalCount = result.totalCount;
                    LoggingService.info('Transactions search successful', { count: result.totalCount });
                })
                .catch(function (error) {
                    vm.error = ErrorHandlerService.handleError(error, 'Failed to search for transactions.');
                    LoggingService.error('Error searching transactions', error);
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function changePage(page) {
            vm.filters.page = page;
            search();
        }

        function sortBy(field) {
            if (vm.filters.sortBy === field) {
                vm.filters.sortDirection = vm.filters.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                vm.filters.sortBy = field;
                vm.filters.sortDirection = 'desc';
            }
            search();
        }
    }
})();