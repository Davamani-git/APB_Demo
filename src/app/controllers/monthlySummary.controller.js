(function () {
    "use strict";

    angular.module("app")
        .controller("MonthlySummaryController", MonthlySummaryController);

    MonthlySummaryController.$inject = ["$routeParams", "DashboardApiService", "NotificationService", "LoggingService", "ENV_CONFIG", "initialSummary"];

    function MonthlySummaryController($routeParams, DashboardApiService, NotificationService, LoggingService, ENV_CONFIG, initialSummary) {
        var vm = this;

        vm.cardId = "";
        vm.month = "";
        vm.summary = null;
        vm.kpis = [];
        vm.breakdownItems = [];
        vm.isLoading = false;
        vm.hasError = false;
        vm.error = null;
        vm.isEmpty = false;

        vm.initialize = initialize;
        vm.onMonthSelected = onMonthSelected;
        vm.loadMonthlySummary = loadMonthlySummary;
        vm.retry = retry;

        initialize(initialSummary);

        function initialize(initial) {
            var routeCardId = $routeParams.cardId;
            var routeMonth = $routeParams.month;

            vm.cardId = routeCardId || "CARD123";
            vm.month = routeMonth || initial.summary.month || getDefaultMonth(ENV_CONFIG.defaultMonthOffset);

            applySummary(initial);

            LoggingService.info("MonthlySummaryController initialized", {
                cardId: vm.cardId,
                month: vm.month
            });
        }

        function onMonthSelected(month) {
            var selectedMonth = month || "";
            if (!selectedMonth) {
                NotificationService.showWarning("Please select a valid month.");
                return;
            }
            var regex = /^\d{4}-(0[1-9]|1[0-2])$/;
            if (!regex.test(selectedMonth)) {
                NotificationService.showWarning("Please select a valid month.");
                return;
            }
            vm.month = selectedMonth;
            loadMonthlySummary();
        }

        function loadMonthlySummary() {
            vm.isLoading = true;
            vm.hasError = false;
            vm.error = null;
            vm.isEmpty = false;

            DashboardApiService.getMonthlySummary(vm.cardId, vm.month)
                .then(function (result) {
                    applySummary(result);
                })
                .catch(function (errorModel) {
                    vm.hasError = true;
                    vm.error = errorModel;
                    NotificationService.showError("Unable to retrieve spending information.");
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function retry() {
            loadMonthlySummary();
        }

        function applySummary(result) {
            if (!result || !result.summary || !result.summary.isValid()) {
                vm.summary = null;
                vm.kpis = [];
                vm.breakdownItems = [];
                vm.isEmpty = true;
                return;
            }

            vm.summary = result.summary;
            vm.kpis = result.kpis || [];
            vm.breakdownItems = result.breakdown || [];
            vm.isEmpty = vm.breakdownItems.length === 0;
        }

        function getDefaultMonth(offset) {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1 + offset;
            while (month < 1) {
                month += 12;
                year -= 1;
            }
            while (month > 12) {
                month -= 12;
                year += 1;
            }
            var monthString = month < 10 ? "0" + month : "" + month;
            return year + "-" + monthString;
        }
    }
})();
