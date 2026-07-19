(function () {
    "use strict";

    MonthlySummaryController.$inject = [
        "MonthlySummaryService",
        "MonthSelectionService",
        "BreakdownService",
        "KpiService",
        "LoggingService",
        "$routeParams",
        "$location",
        "monthAvailability",
        "initialSummary",
        "ErrorModel",
        "ROUTE_CONSTANTS"
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
        initialSummary,
        ErrorModel,
        ROUTE_CONSTANTS
    ) {
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
        vm.onSegmentClick = onSegmentClick;

        initialize();

        function initialize() {
            vm.availableMonths = monthAvailability || [];
            var monthFromRoute = $routeParams.month;
            if (monthFromRoute) {
                vm.selectedMonth = monthFromRoute;
            } else {
                vm.selectedMonth = MonthSelectionService.getDefaultMonth(vm.availableMonths);
            }

            if (initialSummary) {
                handleSummarySuccess(initialSummary);
            } else if (vm.selectedMonth) {
                loadMonthlySummary(vm.selectedMonth);
            }
        }

        function loadMonthlySummary(month) {
            var targetMonth = month || vm.selectedMonth;
            vm.isLoading = true;
            vm.hasError = false;
            vm.error = null;

            MonthlySummaryService.getSummary(targetMonth).then(function (summaryModel) {
                handleSummarySuccess(summaryModel);
                return BreakdownService.getBreakdown(targetMonth);
            }).then(function (breakdownModel) {
                vm.breakdown = breakdownModel;
                vm.isPartial = !!(vm.summary && vm.summary.isPartial && !vm.breakdown);
                vm.isLoading = false;
                LoggingService.info("Monthly summary loaded", { month: targetMonth });
            }).catch(function (errorResponse) {
                handleError(errorResponse);
            });
        }

        function changeMonth(month) {
            var isValid = false;
            for (var i = 0; i < vm.availableMonths.length; i++) {
                if (vm.availableMonths[i].month === month) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
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
            var targetPath = path || ROUTE_CONSTANTS.monthlySummary;
            $location.path(targetPath);
        }

        function onSegmentClick(segment) {
            LoggingService.info("Breakdown segment selected", {
                month: vm.selectedMonth,
                label: segment.label,
                value: segment.value
            });
        }

        function handleSummarySuccess(summaryModel) {
            vm.summary = summaryModel;
            vm.isPartial = !!(summaryModel && summaryModel.isPartial);
            KpiService.buildKpis(summaryModel).then(function (kpis) {
                vm.kpis = kpis;
            });
        }

        function handleError(errorResponse) {
            vm.isLoading = false;
            vm.hasError = true;
            var data = errorResponse && errorResponse.data ? errorResponse.data : {};
            vm.error = new ErrorModel({
                code: data.code || "SERVICE_UNAVAILABLE",
                message: data.message || "We are unable to display your spending summary right now. Please try again later.",
                technicalMessage: "",
                retryable: typeof data.retryable === "boolean" ? data.retryable : true
            });
            LoggingService.error("Failed to load monthly summary", {
                code: vm.error.code,
                month: vm.selectedMonth
            });
        }
    }

    angular.module("app")
        .controller("MonthlySummaryController", MonthlySummaryController);
}());
