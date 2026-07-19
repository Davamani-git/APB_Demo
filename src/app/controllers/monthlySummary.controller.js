(function () {
    "use strict";

    MonthlySummaryController.$inject = ["MonthlySummaryService", "MonthSelectionService", "BreakdownService", "KpiService", "LoggingService", "monthAvailability", "$location"];

    function MonthlySummaryController(MonthlySummaryService, MonthSelectionService, BreakdownService, KpiService, LoggingService, monthAvailability, $location) {
        var vm = this;

        vm.availableMonths = [];
        vm.selectedMonth = "";
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
        vm.goToBreakdownAnalysis = goToBreakdownAnalysis;
        vm.onSegmentClick = onSegmentClick;

        initialize();

        function initialize() {
            vm.isLoading = false;
            vm.hasError = false;
            vm.error = null;

            vm.availableMonths = monthAvailability || [];
            if (!vm.availableMonths || !vm.availableMonths.length) {
                MonthSelectionService.getAvailableMonths().then(function (months) {
                    vm.availableMonths = months;
                    vm.selectedMonth = MonthSelectionService.getDefaultMonth(months);
                    loadMonthlySummary(vm.selectedMonth);
                });
            } else {
                vm.selectedMonth = MonthSelectionService.getDefaultMonth(vm.availableMonths);
                loadMonthlySummary(vm.selectedMonth);
            }
        }

        function loadMonthlySummary(month) {
            var targetMonth = month || vm.selectedMonth;
            vm.isLoading = true;
            vm.hasError = false;
            vm.error = null;
            vm.summary = null;
            vm.kpis = [];
            vm.breakdown = null;
            vm.isPartial = false;

            MonthlySummaryService.getSummary(targetMonth)
                .then(function (summary) {
                    handleSuccess(summary);
                    return BreakdownService.getBreakdown(targetMonth);
                })
                .then(function (breakdown) {
                    vm.breakdown = breakdown;
                    vm.isLoading = false;
                })
                .catch(function (error) {
                    if (error && error.code === "SERVICE_UNAVAILABLE" && error.retryable) {
                        vm.isPartial = true;
                        vm.isLoading = false;
                    } else if (error && error.code === "NO_MOCK_DATA") {
                        vm.isPartial = true;
                        vm.isLoading = false;
                    } else if (error && error.code === "INVALID_MONTH") {
                        handleError(error);
                    } else if (error && error.message) {
                        handleError(error);
                    } else {
                        handleError({
                            code: "UNKNOWN_ERROR",
                            message: "An unexpected error occurred while loading your summary.",
                            retryable: true
                        });
                    }
                });
        }

        function changeMonth(month) {
            if (!month) {
                return;
            }
            var isAvailable = vm.availableMonths.some(function (m) { return m.month === month; });
            if (!isAvailable) {
                handleError({
                    code: "INVALID_MONTH",
                    message: "The selected month is not available.",
                    retryable: false
                });
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

        function navigateTo(path) {
            var target = path || "/spending/monthly-summary";
            $location.path(target);
        }

        function goToBreakdownAnalysis() {
            // Placeholder navigation for deeper analysis entry point
            LoggingService.info("Navigate to breakdown analysis", { month: vm.selectedMonth });
        }

        function onSegmentClick(segment) {
            LoggingService.info("Breakdown segment clicked", { month: vm.selectedMonth, segmentLabel: segment.label });
        }

        function handleSuccess(summary) {
            vm.summary = summary;
            vm.isPartial = !!summary.isPartial;
            vm.kpis = KpiService.buildKpis(summary);
            vm.hasError = false;
            vm.error = null;
            vm.isLoading = false;
            LoggingService.info("Monthly summary loaded", { month: summary.month });
        }

        function handleError(error) {
            vm.hasError = true;
            vm.isLoading = false;
            vm.error = error;
            LoggingService.error("Monthly summary error", { code: error.code, month: vm.selectedMonth });
        }
    }

    angular.module("app")
        .controller("MonthlySummaryController", MonthlySummaryController);
})();
