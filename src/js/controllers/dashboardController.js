/**
 * @file dashboardController.js
 * @description Controller for the main dashboard view. Handles all business logic.
 * @author John Doe, Senior UI Engineer
 * @date 2023-10-26
 */

(function() {
    'use strict';

    angular.module('creditCardDashboardApp')
        .controller('DashboardController', DashboardController);

    // Dependency Injection: $scope for view-model, dataService for data, $filter for data transformation.
    DashboardController.$inject = ['$scope', 'dataService', '$filter', '$timeout'];

    function DashboardController($scope, dataService, $filter, $timeout) {
        var vm = this; // Using 'controller as' syntax (vm for ViewModel)
        $scope.vm = vm;

        // --- INITIALIZATION ---
        vm.isLoading = true;
        vm.isDarkMode = false;
        vm.cards = [];
        vm.transactions = [];
        vm.filteredTransactions = [];
        vm.summary = {};
        vm.analytics = {};
        vm.charts = {};
        vm.filters = { merchant: '', cardId: '', category: '', startDate: null, endDate: null };
        vm.filterOptions = { categories: [] };
        vm.sort = { column: 'date', reverse: true };
        vm.selectedTransaction = null;
        var transactionDetailModal = null;

        // --- PUBLIC METHODS ---
        vm.applyFilters = applyFilters;
        vm.resetFilters = resetFilters;
        vm.sortTransactions = sortTransactions;
        vm.getSortIcon = getSortIcon;
        vm.getCardById = getCardById;
        vm.toggleDarkMode = toggleDarkMode;
        vm.exportToCsv = exportToCsv;
        vm.showTransactionDetails = showTransactionDetails;
        vm.getCategoryColor = getCategoryColor;

        // Initialize the controller
        init();

        // --- METHOD IMPLEMENTATIONS ---

        /**
         * @description Initializes the controller, fetches data, and performs initial calculations.
         */
        function init() {
            // Simulate API latency for a better loading experience demonstration
            $timeout(function() {
                vm.cards = dataService.getCards();
                vm.transactions = dataService.getTransactions();

                // Convert date strings to Date objects for filtering
                vm.transactions.forEach(function(tx) { tx.dateObj = new Date(tx.date); });

                // Populate filter options
                vm.filterOptions.categories = getUniqueCategories(vm.transactions);

                // Perform all initial calculations
                applyFilters();
                
                // Initialize Bootstrap modal instance
                var modalEl = document.getElementById('transactionDetailModal');
                if (modalEl) {
                    transactionDetailModal = new bootstrap.Modal(modalEl);
                }

                vm.isLoading = false;
                console.log('Dashboard Initialized.');
            }, 1500);
        }

        /**
         * @description Applies all active filters to the transaction list and recalculates all dashboard metrics.
         */
        function applyFilters() {
            var filtered = vm.transactions;

            // Apply text search on merchant
            if (vm.filters.merchant) {
                filtered = $filter('filter')(filtered, { merchant: vm.filters.merchant });
            }
            // Filter by card ID
            if (vm.filters.cardId) {
                filtered = filtered.filter(tx => tx.cardId == vm.filters.cardId);
            }
            // Filter by category
            if (vm.filters.category) {
                filtered = filtered.filter(tx => tx.category === vm.filters.category);
            }
            // Filter by date range
            if (vm.filters.startDate) {
                filtered = filtered.filter(tx => tx.dateObj >= vm.filters.startDate);
            }
            if (vm.filters.endDate) {
                // Add 1 day to endDate to make it inclusive
                var inclusiveEndDate = new Date(vm.filters.endDate);
                inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
                filtered = filtered.filter(tx => tx.dateObj < inclusiveEndDate);
            }

            vm.filteredTransactions = filtered;

            // Recalculate everything based on the new filtered list
            calculateAllMetrics(vm.filteredTransactions);
        }
        
        /**
         * @description Resets all filters to their default state and re-applies.
         */
        function resetFilters() {
            vm.filters = { merchant: '', cardId: '', category: '', startDate: null, endDate: null };
            applyFilters();
            console.log('AUDIT: User reset all filters.');
        }

        /**
         * @description Calculates all summary metrics, analytics, and chart data.
         * @param {Array} transactions - The list of transactions to calculate metrics from.
         */
        function calculateAllMetrics(transactions) {
            calculateSummaryMetrics(transactions);
            calculateAnalytics(transactions);
            prepareChartData(transactions);
        }

        /**
         * @description Calculates the top-level summary KPIs.
         */
        function calculateSummaryMetrics() {
            vm.summary.totalCreditLimit = vm.cards.reduce((sum, card) => sum + card.creditLimit, 0);
            vm.summary.totalOutstanding = vm.cards.reduce((sum, card) => sum + card.outstanding, 0);
            vm.summary.totalAvailableCredit = vm.cards.reduce((sum, card) => sum + card.availableCredit, 0);
            vm.summary.totalUtilization = (vm.summary.totalOutstanding / vm.summary.totalCreditLimit) * 100;

            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            vm.summary.totalMonthlySpend = vm.transactions
                .filter(tx => tx.dateObj >= firstDayOfMonth)
                .reduce((sum, tx) => sum + tx.amount, 0);
        }

        /**
         * @description Calculates advanced analytics like top spenders and forecasts.
         * @param {Array} transactions - The list of transactions to analyze.
         */
        function calculateAnalytics(transactions) {
            // Top Categories
            const categorySpend = groupAndSum(transactions, 'category', 'amount');
            vm.analytics.topCategories = Object.entries(categorySpend)
                .map(([category, amount]) => ({ category, amount }))
                .sort((a, b) => b.amount - a.amount);

            // Top Merchants
            const merchantSpend = groupAndSum(transactions, 'merchant', 'amount');
            vm.analytics.topMerchants = Object.entries(merchantSpend)
                .map(([merchant, amount]) => ({ merchant, amount }))
                .sort((a, b) => b.amount - a.amount);

            // Monthly Spend Forecast
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const dayOfMonth = today.getDate();
            vm.analytics.spendForecast = (vm.summary.totalMonthlySpend / dayOfMonth) * daysInMonth;
        }

        /**
         * @description Prepares data structures required by Chart.js directives.
         * @param {Array} transactions - The list of transactions to visualize.
         */
        function prepareChartData(transactions) {
            // 1. Category Pie Chart
            const categorySpend = groupAndSum(transactions, 'category', 'amount');
            vm.charts.category = {
                labels: Object.keys(categorySpend),
                data: Object.values(categorySpend),
                options: { legend: { display: true, position: 'right' } },
                colors: ['#6f42c1', '#fd7e14', '#0d6efd', '#d63384', '#198754', '#dc3545', '#6c757d']
            };

            // 2. Monthly Line Chart (Last 12 Months)
            const monthlySpend = {};
            const monthLabels = [];
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthKey = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().slice(-2);
                monthLabels.push(monthKey);
                monthlySpend[monthKey] = 0;
            }
            vm.transactions.forEach(tx => {
                const monthKey = tx.dateObj.toLocaleString('default', { month: 'short' }) + ' ' + tx.dateObj.getFullYear().toString().slice(-2);
                if (monthlySpend.hasOwnProperty(monthKey)) {
                    monthlySpend[monthKey] += tx.amount;
                }
            });
            vm.charts.monthly = {
                labels: monthLabels,
                series: ['Monthly Spend'],
                data: [Object.values(monthlySpend)],
                options: { legend: { display: false } }
            };

            // 3. Card Bar Chart
            const cardSpend = groupAndSum(transactions, 'cardId', 'amount');
            vm.charts.card = {
                labels: Object.keys(cardSpend).map(id => getCardById(id).cardName),
                data: [Object.values(cardSpend)],
                options: { legend: { display: false } }
            };
        }

        /**
         * @description Toggles the sorting column and direction for the transaction table.
         * @param {string} column - The column name to sort by.
         */
        function sortTransactions(column) {
            if (vm.sort.column === column) {
                vm.sort.reverse = !vm.sort.reverse;
            } else {
                vm.sort.column = column;
                vm.sort.reverse = false;
            }
        }

        /**
         * @description Returns the appropriate Font Awesome icon class for the sort indicator.
         * @param {string} column - The column name to check.
         * @returns {string} The CSS class for the icon.
         */
        function getSortIcon(column) {
            if (vm.sort.column !== column) return 'fa-sort';
            return vm.sort.reverse ? 'fa-sort-down' : 'fa-sort-up';
        }

        /**
         * @description Finds a credit card object by its ID.
         * @param {number|string} id - The ID of the card to find.
         * @returns {object} The card object or an empty object if not found.
         */
        function getCardById(id) {
            return vm.cards.find(card => card.id == id) || {};
        }

        /**
         * @description Toggles dark mode by adding/removing a class to the body.
         */
        function toggleDarkMode() {
            // The ng-class on the body element handles the class switching.
            console.log('UI: Dark mode toggled to ' + (vm.isDarkMode ? 'On' : 'Off'));
        }

        /**
         * @description Exports the currently filtered transactions to a CSV file.
         */
        function exportToCsv() {
            console.log(`AUDIT: User initiated CSV export of ${vm.filteredTransactions.length} transactions.`);
            const headers = ['Date', 'Merchant', 'Category', 'Amount', 'CardName', 'CardNumber (Masked)'];
            const rows = vm.filteredTransactions.map(tx => {
                const card = getCardById(tx.cardId);
                return [
                    $filter('date')(tx.date, 'yyyy-MM-dd'),
                    `"${tx.merchant}"`, // Handle commas in merchant names
                    tx.category,
                    tx.amount,
                    card.cardName,
                    card.cardNumber
                ].join(',');
            });

            const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /**
         * @description Sets the selected transaction and shows the detail modal.
         * @param {object} transaction - The transaction object to display.
         */
        function showTransactionDetails(transaction) {
            vm.selectedTransaction = transaction;
            if (transactionDetailModal) {
                transactionDetailModal.show();
            }
        }
        
        /**
         * @description Returns a color class based on category for visual distinction.
         * @param {string} category - The category name.
         * @returns {string} A color class name.
         */
        function getCategoryColor(category) {
            // Simple mapping for consistent badge colors
            const colorMap = {
                'Food': 'Food',
                'Shopping': 'Shopping',
                'Travel': 'Travel',
                'Entertainment': 'Entertainment',
                'Utilities': 'Utilities',
                'Healthcare': 'Healthcare',
                'Miscellaneous': 'Miscellaneous'
            };
            return colorMap[category] || 'Miscellaneous';
        }

        // --- UTILITY HELPERS ---

        function getUniqueCategories(transactions) {
            return [...new Set(transactions.map(tx => tx.category))].sort();
        }

        function groupAndSum(items, groupByKey, sumByKey) {
            return items.reduce((acc, item) => {
                const key = item[groupByKey];
                acc[key] = (acc[key] || 0) + item[sumByKey];
                return acc;
            }, {});
        }
    }
})();
