(function () {
    'use strict';

    MonthlySummaryController.$inject = [
        'MonthlySummaryService',
        'MonthSelectionService',
        'BreakdownService',
        'KpiService',
        'LoggingService',
        '$routeParams',
        '$location',
        'monthAvailability',
        'initialSummary'
    ];

    function MonthlySummaryController(
        MonthlySummaryService,
        MonthSelectionService,
        BreakdownService,
        KpiService,
        LoggingService,
        $routeParams,
        $location,
        monthAvailability,
        initialSummary
    ) {
        var vm = this;

        vm.availableMonths = monthAvailability || [];
        vm.selectedMonth = null;
        vm.summary = null;
        vm.kpis = [];
        vm.breakdown = null;
        vm.isLoading = false;
        vm.hasError = false;
        vm.error = null;
        vm.isPartial = false;

        vm.initialize = initialize;
        vm.loadMonthlySummary = loadMonthlySummary;
        vm.changeMonth = changeMonth;
        vm.retry = retry;
        vm.navigateTo = navigateTo;
        vm.onBreakdownSegmentClick = onBreakdownSegmentClick;

        initialize();

        function initialize() {
            var routeMonth = $routeParams.month;
            if (routeMonth) {
                vm.selectedMonth = routeMonth;
            } else if (vm.availableMonths && vm.availableMonths.length) {
                vm.selectedMonth = MonthSelectionService.getDefaultMonth(vm.availableMonths);
            }

            if (!vm.selectedMonth && vm.availableMonths && vm.availableMonths.length) {
                vm.selectedMonth = MonthSelectionService.getDefaultMonth(vm.availableMonths);
            }

            if (initialSummary) {
                vm.summary = initialSummary;
                vm.isPartial = !!initialSummary.isPartial;
                vm.kpis = KpiService.buildKpis(initialSummary);
                loadBreakdown(initialSummary.month);
            } else if (vm.selectedMonth) {
                loadMonthlySummary(vm.selectedMonth);
            }
        }

        function loadMonthlySummary(month) {
            var targetMonth = month || vm.selectedMonth;
            if (!targetMonth) {
                return;
            }

            vm.isLoading = true;
            vm.hasError = false;
            vm.error = null;

            MonthlySummaryService.getSummary(targetMonth)
                .then(function (summaryModel) {
                    handleSuccess(summaryModel);
                })
                .catch(function (errorModel) {
                    handleError(errorModel);
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function changeMonth(month) {
            var isValidMonth = vm.availableMonths.some(function (m) { return m.month === month; });
            if (!isValidMonth) {
                return;
            }
            vm.selectedMonth = month;
            $location.search('month', month);
            loadMonthlySummary(month);
        }

        function retry() {
            if (vm.selectedMonth) {
                loadMonthlySummary(vm.selectedMonth);
            }
        }

        function navigateTo(path) {
            if (!path) {
                path = '/spending/monthly-summary';
            }
            $location.path(path);
        }

        function onBreakdownSegmentClick(segment) {
            LoggingService.info('Breakdown segment clicked', {
                month: vm.selectedMonth,
                segmentLabel: segment && segment.label
            });
            // Entry point into deeper analyses would navigate here using preserved month context.
        }

        function loadBreakdown(month) {
            BreakdownService.getBreakdown(month).then(function (breakdownModel) {
                vm.breakdown = breakdownModel;
            });
        }

        function handleSuccess(summaryModel) {
            vm.summary = summaryModel;
            vm.isPartial = !!summaryModel.isPartial;
            vm.kpis = KpiService.buildKpis(summaryModel);
            loadBreakdown(summaryModel.month);
            LoggingService.info('Monthly summary loaded', { month: summaryModel.month });
        }

        function handleError(errorModel) {
            vm.hasError = true;
            vm.error = errorModel;
            vm.summary = null;
            vm.kpis = [];
            vm.breakdown = null;
            LoggingService.error('Monthly summary load failed', { month: vm.selectedMonth, code: errorModel.code });
        }
    }

    angular.module('app')
        .controller('MonthlySummaryController', MonthlySummaryController);
})();
