angular.module('apbDemo.dashboard')
.controller('DashboardController', ['TransactionDataService', 'AnalyticsEngineService', 'LoggingService', function(TransactionDataService, AnalyticsEngineService, LoggingService) {
    var vm = this;
    vm.loading = false;
    vm.error = null;
    vm.categorySummaries = [];
    vm.cardSummaries = [];
    vm.trendSeries = [];

    function init() {
        vm.refreshAnalytics();
    }

    vm.refreshAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        LoggingService.info('Fetching new transaction data.');

        TransactionDataService.getTransactions({ from: '2023-01-01', to: '2023-01-31' })
            .then(function(transactions) {
                vm.categorySummaries = AnalyticsEngineService.computeCategoryBreakdown(transactions);
                vm.cardSummaries = AnalyticsEngineService.computeCardBreakdown(transactions);
                vm.trendSeries = AnalyticsEngineService.computeTrendSeries(transactions, 'daily');
                LoggingService.info('Analytics updated successfully.');
            })
            .catch(function(errorModel) {
                vm.error = errorModel; // Set error model for the banner
            })
            .finally(function() {
                vm.loading = false;
            });
    };

    init();
}]);