(function () {
    'use strict';

    angular
        .module('app')
        .controller('AnalyticsController', AnalyticsController);

    AnalyticsController.$inject = ['AnalyticsService', 'LoggingService', 'ErrorHandlerService'];

    function AnalyticsController(AnalyticsService, LoggingService, ErrorHandlerService) {
        var vm = this;

        vm.params = {
            dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            dateTo: new Date(),
            cardIds: []
        };
        vm.analyticsData = {};
        vm.isLoading = false;
        vm.error = null;

        vm.refreshAnalytics = refreshAnalytics;

        activate();

        function activate() {
            LoggingService.info('AnalyticsController activated');
            refreshAnalytics();
        }

        function refreshAnalytics() {
            vm.isLoading = true;
            vm.error = null;
            AnalyticsService.getSpendingAnalytics(vm.params)
                .then(function (data) {
                    vm.analyticsData = data;
                    LoggingService.info('Analytics data loaded successfully');
                })
                .catch(function (error) {
                    vm.error = ErrorHandlerService.handleError(error, 'Failed to load analytics data.');
                    LoggingService.error('Error loading analytics data', error);
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }
    }
})();