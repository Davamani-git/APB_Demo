(function () {
    'use strict';

    MonthlySummaryController.$inject = ['MonthlySummaryService', 'EnvConfigService', 'LoggingService', '$filter', 'MonthlySummaryModel', 'ErrorModel', 'KpiModel'];

    function MonthlySummaryController(MonthlySummaryService, EnvConfigService, LoggingService, $filter, MonthlySummaryModel, ErrorModel, KpiModel) {
        var vm = this;

        vm.summary = null;
        vm.error = null;
        vm.loading = false;
        vm.selectedMonth = getCurrentMonth();
        vm.selectedAccountId = '';
        vm.kpis = [];

        vm.loadSummary = loadSummary;
        vm.onMonthChange = onMonthChange;
        vm.retry = retry;
        vm.hasError = hasError;
        vm.hasData = hasData;

        activate();

        function activate() {
            loadSummary(vm.selectedMonth, vm.selectedAccountId);
        }

        function getCurrentMonth() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var monthString = month < 10 ? '0' + month : '' + month;
            return year + '-' + monthString;
        }

        function buildRequestModel(month, accountId) {
            return {
                customerId: 'CURRENT',
                accountId: accountId || 'PRIMARY',
                month: month
            };
        }

        function loadSummary(month, accountId) {
            vm.loading = true;
            vm.error = null;
            vm.summary = null;

            var requestModel = buildRequestModel(month, accountId);

            MonthlySummaryService.getMonthlySummary(requestModel)
                .then(function (data) {
                    vm.summary = new MonthlySummaryModel(data);
                    vm.kpis = buildKpis(vm.summary);
                    vm.loading = false;
                })
                .catch(function (error) {
                    vm.loading = false;
                    vm.summary = null;
                    vm.error = new ErrorModel({
                        code: error.data && error.data.code ? error.data.code : 'UNKNOWN_ERROR',
                        httpStatus: error.status || 0,
                        message: error.data && error.data.message ? error.data.message : "We're unable to show your monthly summary right now.",
                        retryable: error.status === 503 || error.status === 500 || error.status === 429
                    });
                    LoggingService.error('Failed to load monthly summary', {
                        status: error.status,
                        code: vm.error.code
                    });
                });
        }

        function buildKpis(summary) {
            var env = EnvConfigService.getActiveEnv();
            var kpis = [];

            kpis.push(new KpiModel({
                label: 'Total Spend',
                value: summary.totalSpend,
                icon: 'src/assets/icons/kpi-total.svg',
                cssClass: 'kpi-total'
            }));

            kpis.push(new KpiModel({
                label: 'Transactions',
                value: summary.transactionCount,
                icon: 'src/assets/icons/kpi-count.svg',
                cssClass: 'kpi-count'
            }));

            if (env.featureFlags.showAverageTransaction) {
                kpis.push(new KpiModel({
                    label: 'Average Transaction',
                    value: summary.averageTransactionAmount,
                    icon: 'src/assets/icons/kpi-average.svg',
                    cssClass: 'kpi-average'
                }));
            }

            return kpis;
        }

        function onMonthChange(month) {
            vm.selectedMonth = month;
            loadSummary(vm.selectedMonth, vm.selectedAccountId);
        }

        function retry() {
            if (vm.error && vm.error.retryable) {
                loadSummary(vm.selectedMonth, vm.selectedAccountId);
            }
        }

        function hasError() {
            return !!vm.error;
        }

        function hasData() {
            return !!vm.summary && !vm.summary.isEmpty();
        }
    }

    angular
        .module('app')
        .controller('MonthlySummaryController', MonthlySummaryController);
})();
