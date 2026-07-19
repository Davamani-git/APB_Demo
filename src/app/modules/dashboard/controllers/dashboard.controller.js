(function () {
    'use strict';

    DashboardController.$inject = ['$scope', '$routeParams', 'SummaryService', 'TrendsService', 'ConfigService', 'LoggingService', 'ENV_CONFIG'];

    function DashboardController($scope, $routeParams, SummaryService, TrendsService, ConfigService, LoggingService, ENV_CONFIG) {
        var vm = this;

        vm.selectedMonth = null;
        vm.availableMonths = [];
        vm.summary = null;
        vm.trends = null;
        vm.config = null;
        vm.isLoadingSummary = false;
        vm.isLoadingTrends = false;
        vm.summaryError = null;
        vm.trendsError = null;
        vm.validationErrors = {
            month: null
        };
        vm.dataRefreshTimestamp = null;

        vm.initialize = initialize;
        vm.onMonthChange = onMonthChange;
        vm.retrySummary = retrySummary;
        vm.retryTrends = retryTrends;
        vm.refreshAll = refreshAll;

        function initialize() {
            LoggingService.info('Dashboard initialized', {});
            initMonths();
            loadConfig();
            var routeMonth = $routeParams.month;
            if (routeMonth && isValidMonth(routeMonth)) {
                vm.selectedMonth = routeMonth;
            } else {
                vm.selectedMonth = vm.availableMonths.length > 0 ? vm.availableMonths[0] : getCurrentMonth();
            }
            loadMonthlySummary(vm.selectedMonth);
            loadSixMonthTrends();
        }

        function initMonths() {
            var maxMonths = ENV_CONFIG.maxLookbackMonths || 6;
            var current = new Date();
            vm.availableMonths = [];
            for (var i = 0; i < maxMonths; i++) {
                var d = new Date(current.getFullYear(), current.getMonth() - i, 1);
                var monthStr = d.getFullYear() + '-' + padMonth(d.getMonth() + 1);
                vm.availableMonths.push(monthStr);
            }
        }

        function padMonth(m) {
            return m < 10 ? '0' + m : '' + m;
        }

        function getCurrentMonth() {
            var d = new Date();
            return d.getFullYear() + '-' + padMonth(d.getMonth() + 1);
        }

        function onMonthChange(month) {
            vm.validationErrors.month = null;
            if (!isValidMonth(month)) {
                vm.validationErrors.month = 'Please select a valid month.';
                LoggingService.warn('Invalid month selection', { month: month });
                return;
            }
            vm.selectedMonth = month;
            loadMonthlySummary(vm.selectedMonth);
        }

        function retrySummary() {
            vm.summaryError = null;
            loadMonthlySummary(vm.selectedMonth);
        }

        function retryTrends() {
            vm.trendsError = null;
            loadSixMonthTrends();
        }

        function refreshAll() {
            loadMonthlySummary(vm.selectedMonth);
            loadSixMonthTrends();
        }

        function loadConfig() {
            ConfigService.getConfig()
                .then(function (configModel) {
                    vm.config = configModel;
                })
                .catch(function (errorModel) {
                    LoggingService.error('Config load failed', { error: errorModel });
                    vm.config = null;
                });
        }

        function loadMonthlySummary(month) {
            vm.isLoadingSummary = true;
            vm.summaryError = null;
            SummaryService.getMonthlySummary(month)
                .then(function (summaryModel) {
                    vm.summary = summaryModel;
                    vm.dataRefreshTimestamp = new Date();
                })
                .catch(function (errorModel) {
                    vm.summary = null;
                    vm.summaryError = errorModel;
                    LoggingService.error('Monthly summary load failed', { error: errorModel });
                })
                .finally(function () {
                    vm.isLoadingSummary = false;
                });
        }

        function loadSixMonthTrends() {
            vm.isLoadingTrends = true;
            vm.trendsError = null;
            TrendsService.getSixMonthTrends()
                .then(function (trendModel) {
                    vm.trends = trendModel;
                })
                .catch(function (errorModel) {
                    vm.trends = null;
                    vm.trendsError = errorModel;
                    LoggingService.error('Six-month trends load failed', { error: errorModel });
                })
                .finally(function () {
                    vm.isLoadingTrends = false;
                });
        }

        function isValidMonth(month) {
            var regex = /^\d{4}-\d{2}$/;
            if (!regex.test(month)) {
                return false;
            }
            var year = parseInt(month.substring(0, 4), 10);
            var m = parseInt(month.substring(5, 7), 10);
            if (m < 1 || m > 12) {
                return false;
            }
            var now = new Date();
            var candidate = new Date(year, m - 1, 1);
            return candidate <= now;
        }

        vm.initialize();
    }

    angular.module('app')
        .controller('DashboardController', DashboardController);

})();
