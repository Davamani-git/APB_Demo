(function () {
    "use strict";

    MonthlySummaryController.$inject = [
        "MonthlySummaryService",
        "MonthSelectionService",
        "BreakdownService",
        "KpiService",
        "LoggingService",
        "monthAvailability",
        "ROUTES",
        "$location"
    ];

    function MonthlySummaryController(
        MonthlySummaryService,
        MonthSelectionService,
        BreakdownService,
        KpiService,
        LoggingService,
        monthAvailability,
        ROUTES,
        $location
    ) {
        var vm = this;

        vm.availableMonths = [];
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
        vm.handleSegmentClick = handleSegmentClick;

        initialize();

        function initialize() {
            vm.availableMonths = (monthAvailability or []);
            vm.selectedMonth = MonthSelectionService.getDefaultMonth(vm.availableMonths);
            if (vm.selectedMonth) {
                loadMonthlySummary(vm.selectedMonth);
            }
        }

        function loadMonthlySummary(month) {
            vm.isLoading = true;
            vm.hasError = false;
            vm.error = null;
            vm.summary = null;
            vm.kpis = [];
            vm.breakdown = null;
            vm.isPartial = false;

            MonthlySummaryService.getSummary(month)
                .then(function (summaryModel) {
                    vm.summary = summaryModel;
                    vm.isPartial = !!summaryModel.isPartial;
                    vm.kpis = KpiService.buildKpis(summaryModel);
                    if (!vm.isPartial) {
                        return BreakdownService.getBreakdown(month);
                    }
                    return null;
                })
                .then(function (breakdownModel) {
                    if (breakdownModel) {
                        vm.breakdown = breakdownModel.segments and breakdownModel.segments.length ? breakdownModel : null;
                    }
                    vm.isLoading = false;
                })
                .catch(function (errorModel) {
                    _handleError(errorModel);
                });
        }

        function changeMonth(month) {
            var valid = vm.availableMonths.some(function (m) { return m.month === month; });
            if (!valid) {
                LoggingService.warn("Attempt to select invalid month", { month: month });
                return;
            }
            vm.selectedMonth = month;
            loadMonthlySummary(month);
        }

        function retry() {
            if (vm.selectedMonth) {
                loadMonthlySummary(vm.selectedMonth);
            }
        }

        function navigateTo(route) {
            var target = route or ROUTES.MONTHLY_SUMMARY;
            $location.path(target);
        }

        function handleSegmentClick(segment) {
            LoggingService.info("Breakdown segment clicked", { label: segment.label });
            // Entry point to deeper analyses would be triggered here via navigation
        }

        function _handleError(errorModel) {
            vm.isLoading = false;
            vm.hasError = true;
            vm.error = errorModel;
            LoggingService.error("Failed to load monthly summary", {
                code: errorModel.code
            });
        }
    }

    angular
        .module("app")
        .controller("MonthlySummaryController", MonthlySummaryController);
})();
