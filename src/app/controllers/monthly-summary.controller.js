(function () {
    'use strict';

    angular.module('apbDemo')
        .controller('MonthlySummaryController', MonthlySummaryController);

    MonthlySummaryController.$inject = ['$scope', 'MonthContextService', 'MonthlySummaryService', 'KpiService', 'BreakdownService', 'LoggingService', 'ErrorHandlingService', '$routeParams', 'EnvConfigService'];

    function MonthlySummaryController($scope, MonthContextService, MonthlySummaryService, KpiService, BreakdownService, LoggingService, ErrorHandlingService, $routeParams, EnvConfigService) {
        var vm = this;

        vm.monthContext = null;
        vm.selectedMonth = null;
        vm.summary = null;
        vm.kpis = [];
        vm.breakdown = null;
        vm.isLoadingSummary = false;
        vm.isLoadingKpis = false;
        vm.isLoadingBreakdown = false;
        vm.summaryError = null;
        vm.kpiError = null;
        vm.breakdownError = null;
        vm.deeperInsightsAvailable = true;

        vm.initialize = initialize;
        vm.onMonthChange = onMonthChange;
        vm.refresh = refresh;
        vm.retrySummary = retrySummary;
        vm.retryKpis = retryKpis;
        vm.retryBreakdown = retryBreakdown;
        vm.navigateToAnalytics = navigateToAnalytics;

        initialize();

        function initialize() {
            if ($routeParams && $routeParams.month) {
                vm.selectedMonth = $routeParams.month;
            }

            MonthContextService.getCachedContext().then(function (context) {
                vm.monthContext = context;
                if (!vm.selectedMonth) {
                    vm.selectedMonth = context.defaultMonth;
                }
                loadMonthlySummary();
                loadKpis();
                loadBreakdown();
                var featureFlags = EnvConfigService.getFeatureFlags();
                vm.deeperInsightsAvailable = !(featureFlags && featureFlags.disableDeeperInsights === true);
            }).catch(function (errorModel) {
                vm.summaryError = errorModel;
                vm.kpiError = errorModel;
                vm.breakdownError = errorModel;
            });

            $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
                LoggingService.error('Route change error in MonthlySummaryController.', {
                    current: current,
                    previous: previous,
                    rejection: rejection
                });
            });
        }

        function onMonthChange(month) {
            if (!month || !vm.monthContext || !vm.monthContext.months) {
                return;
            }
            var isValid = false;
            for (var i = 0; i < vm.monthContext.months.length; i++) {
                if (vm.monthContext.months[i].month === month) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                var validationError = ErrorHandlingService.createClientValidationError('Selected month is outside the supported range.');
                vm.summaryError = validationError;
                vm.kpiError = validationError;
                vm.breakdownError = validationError;
                return;
            }
            vm.selectedMonth = month;
            loadMonthlySummary();
            loadKpis();
            loadBreakdown();
        }

        function refresh() {
            loadMonthlySummary();
            loadKpis();
            loadBreakdown();
        }

        function retrySummary() {
            vm.summaryError = null;
            loadMonthlySummary();
        }

        function retryKpis() {
            vm.kpiError = null;
            loadKpis();
        }

        function retryBreakdown() {
            vm.breakdownError = null;
            loadBreakdown();
        }

        function loadMonthlySummary() {
            vm.isLoadingSummary = true;
            vm.summaryError = null;
            MonthlySummaryService.getSummary(vm.selectedMonth).then(function (summaryModel) {
                vm.summary = summaryModel;
                vm.isLoadingSummary = false;
            }).catch(function (errorModel) {
                vm.summaryError = errorModel;
                vm.isLoadingSummary = false;
            });
        }

        function loadKpis() {
            vm.isLoadingKpis = true;
            vm.kpiError = null;
            KpiService.getKpis(vm.selectedMonth).then(function (kpiList) {
                vm.kpis = kpiList;
                vm.isLoadingKpis = false;
            }).catch(function (errorModel) {
                vm.kpiError = errorModel;
                vm.isLoadingKpis = false;
            });
        }

        function loadBreakdown() {
            vm.isLoadingBreakdown = true;
            vm.breakdownError = null;
            BreakdownService.getBreakdown(vm.selectedMonth).then(function (breakdownModel) {
                vm.breakdown = breakdownModel;
                vm.isLoadingBreakdown = false;
            }).catch(function (errorModel) {
                vm.breakdownError = errorModel;
                vm.isLoadingBreakdown = false;
            });
        }

        function navigateToAnalytics() {
            if (!vm.deeperInsightsAvailable) {
                return;
            }
            var analyticsUrl = EnvConfigService.getAnalyticsUrl();
            if (analyticsUrl && analyticsUrl !== '#') {
                var targetUrl = analyticsUrl + '?month=' + encodeURIComponent(vm.selectedMonth || '');
                window.location.href = targetUrl;
            }
        }
    }
})();
