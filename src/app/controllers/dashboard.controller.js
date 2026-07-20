(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location', 'dashboardData', 'LoggingService', 'ErrorHandlerService'];

    function DashboardController($location, dashboardData, LoggingService, ErrorHandlerService) {
        var vm = this;

        vm.summary = null;
        vm.cards = [];
        vm.budget = null;
        vm.recentTransactions = [];
        vm.error = null;

        vm.viewAllTransactions = viewAllTransactions;

        activate();

        function activate() {
            LoggingService.info('DashboardController activated');
            if (dashboardData) {
                vm.summary = dashboardData.summary;
                vm.cards = dashboardData.cards;
                vm.budget = dashboardData.budget;
                vm.recentTransactions = dashboardData.recentTransactions;
            } else {
                vm.error = ErrorHandlerService.handleError(null, 'Dashboard data could not be loaded.');
                LoggingService.error('Dashboard data was not resolved.', {});
            }
        }

        function viewAllTransactions() {
            $location.path('/transactions');
        }
    }
})();