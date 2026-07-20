/**
 * dashboardController.js
 * 
 * Controller for the main dashboard view.
 * Handles all the logic for data presentation, filtering, and user interactions.
 * 
 * Design Decision: Using the 'controller as' syntax (vm = this) is a best practice that avoids
 * common issues with '$scope' inheritance and makes the view bindings more explicit and readable.
 * This aligns with modern component-based architecture principles.
 */

(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .controller('DashboardController', DashboardController);

    // Dependency Injection: Explicitly injecting services for robustness and testability.
    DashboardController.$inject = ['dataService', '$timeout', '$filter'];

    function DashboardController(dataService, $timeout, $filter) {
        var vm = this;

        // --- ViewModel Properties ---
        vm.loading = true;
        vm.isDarkMode = false;
        vm.cards = [];
        vm.transactions = [];
        vm.filteredTransactions = [];
        vm.summary = {};
        vm.analytics = {};
        vm.charts = { monthly: {}, category: {} };
        vm.filters = { search: {}, category: '', cardId: '' };
        vm.filterOptions = { categories: [] };
        vm.sort = { column: 'date', reverse: true };
        vm.selectedTransaction = null;
        var transactionModalInstance = null;

        // --- ViewModel Methods ---
        vm.init = init;
        vm.toggleDarkMode = toggleDarkMode;
        vm.getCardName = getCardName;
        vm.getCategoryClass = getCategoryClass;
        vm.sortBy = sortBy;
        vm.getSortIcon = getSortIcon;
        vm.resetFilters = resetFilters;
        vm.exportToCsv = exportToCsv;
        vm.showTransactionDetails = showTransactionDetails;

        // --- Initialization ---
        vm.init();

        // --- Method Implementations ---

        /**
         * Initializes the controller, fetches data, and sets up the dashboard.
         */
        function init() {
            vm.loading = true;
            // Using promises to handle asynchronous data fetching, simulating an API call.
            var cardsPromise = dataService.getCards();
            var transactionsPromise = dataService.getTransactions();

            // Promise.all is efficient for parallel data fetching.
            Promise.all([cardsPromise, transactionsPromise]).then(function(results) {
                vm.cards = results[0];
                vm.transactions = results[1];

                // Process data only after it's fully loaded.
                calculateDashboardSummary();
                prepareAnalyticsAndCharts();
                prepareFilterOptions();

                // Use $timeout to ensure the DOM has rendered before manipulating it (for modal)
                // and to safely apply scope changes from a non-Angular context (Promise.then).
                $timeout(function() {
                    vm.loading = false;
                    // Initialize Bootstrap modal instance
                    var transactionModalEl = document.getElementById('transactionModal');
                    if (transactionModalEl) {
                        transactionModalInstance = new bootstrap.Modal(transactionModalEl);
                    }
                }, 500); // A small delay to simulate network latency and show the loader.
            });
        }

        /**
         * Calculates all summary metrics for the top dashboard cards.
         */
        function calculateDashboardSummary() {
            vm.summary.totalCreditLimit = vm.cards.reduce((sum, card) => sum + card.creditLimit, 0);
            vm.summary.totalAvailableCredit = vm.cards.reduce((sum, card) => sum + card.availableCredit, 0);
            vm.summary.totalOutstanding = vm.cards.reduce((sum, card) => sum + card.outstanding, 0);
            vm.summary.avgUtilization = vm.summary.totalCreditLimit > 0 ? (vm.summary.totalOutstanding / vm.summary.totalCreditLimit * 100) : 0;
            
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            vm.summary.totalMonthlySpend = vm.transactions
                .filter(tx => new Date(tx.date).getMonth() === currentMonth && new Date(tx.date).getFullYear() === currentYear)
                .reduce((sum, tx) => sum + tx.amount, 0);
        }

        /**
         * Processes transaction data to generate analytics and chart data structures.
         */
        function prepareAnalyticsAndCharts() {
            // --- Monthly Spend Trend (Line Chart) ---
            const monthlySpend = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            vm.transactions.forEach(tx => {
                const date = new Date(tx.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
                if (!monthlySpend[monthKey]) {
                    monthlySpend[monthKey] = 0;
                }
                monthlySpend[monthKey] += tx.amount;
            });

            const sortedMonths = Object.keys(monthlySpend).sort();
            vm.charts.monthly.labels = sortedMonths.map(key => {
                const [year, month] = key.split('-');
                return `${monthNames[parseInt(month)]} '${year.slice(2)}`;
            });
            vm.charts.monthly.data = [sortedMonths.map(key => monthlySpend[key].toFixed(2))];
            vm.charts.monthly.series = ['Monthly Spend'];
            vm.charts.monthly.options = { legend: { display: false }, tooltips: { callbacks: { label: (item, data) => `Spend: ${$filter('currency')(item.yLabel, '€')}` } } };

            // --- Category Spend (Doughnut Chart) & Top Categories ---
            const categorySpend = {};
            vm.transactions.forEach(tx => {
                if (!categorySpend[tx.category]) {
                    categorySpend[tx.category] = 0;
                }
                categorySpend[tx.category] += tx.amount;
            });

            vm.charts.category.labels = Object.keys(categorySpend);
            vm.charts.category.data = Object.values(categorySpend).map(v => v.toFixed(2));
            vm.charts.category.options = { legend: { position: 'right' }, tooltips: { callbacks: { label: (item, data) => `${data.labels[item.index]}: ${$filter('currency')(data.datasets[0].data[item.index], '€')}` } } };

            vm.analytics.topCategories = Object.entries(categorySpend)
                .map(([category, amount]) => ({ category, amount }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);

            // --- Top Merchants ---
            const merchantSpend = {};
            vm.transactions.forEach(tx => {
                if (!merchantSpend[tx.merchant]) {
                    merchantSpend[tx.merchant] = 0;
                }
                merchantSpend[tx.merchant] += tx.amount;
            });
            vm.analytics.topMerchants = Object.entries(merchantSpend)
                .map(([merchant, amount]) => ({ merchant, amount }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);

            // --- Monthly Spend Forecast ---
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const dayOfMonth = today.getDate();
            vm.analytics.spendForecast = (vm.summary.totalMonthlySpend / dayOfMonth) * daysInMonth;
        }

        /**
         * Extracts unique categories from transactions for the filter dropdown.
         */
        function prepareFilterOptions() {
            const categories = new Set(vm.transactions.map(tx => tx.category));
            vm.filterOptions.categories = Array.from(categories).sort();
        }

        /**
         * Toggles dark mode class on the body.
         */
        function toggleDarkMode() {
            // This is a UI/UX feature. In a real app, user preference would be saved
            // to localStorage or a user profile via an API.
            // vm.isDarkMode is already bound via ng-model
        }

        /**
         * Retrieves card name from its ID. Caching this in a map improves performance.
         */
        const cardNameMap = new Map();
        function getCardName(cardId) {
            if (cardNameMap.size === 0 && vm.cards.length > 0) {
                vm.cards.forEach(c => cardNameMap.set(c.id, c.cardName));
            }
            return cardNameMap.get(cardId) || 'Unknown Card';
        }

        /**
         * Returns a dynamic CSS class for category badges.
         */
        function getCategoryClass(category) {
            if (!category) return 'bg-miscellaneous';
            const className = 'bg-' + category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            return className;
        }

        /**
         * Handles sorting logic for the transaction table.
         */
        function sortBy(column) {
            if (vm.sort.column === column) {
                vm.sort.reverse = !vm.sort.reverse;
            } else {
                vm.sort.column = column;
                vm.sort.reverse = false;
            }
        }

        /**
         * Provides the correct Font Awesome icon class based on the current sort state.
         */
        function getSortIcon(column) {
            if (vm.sort.column !== column) {
                return 'fa-sort';
            }
            return vm.sort.reverse ? 'fa-sort-down' : 'fa-sort-up';
        }

        /**
         * Resets all active filters to their default state.
         */
        function resetFilters() {
            vm.filters = { search: {}, category: '', cardId: '' };
        }

        /**
         * Exports the currently filtered transactions to a CSV file.
         * Security Note: Data is sourced from the client-side model. No server interaction needed.
         * This is a safe operation as it doesn't expose any sensitive system information.
         */
        function exportToCsv() {
            const headers = ['Date', 'Merchant', 'Category', 'Card', 'Amount'];
            const csvRows = [headers.join(',')];

            vm.filteredTransactions.forEach(tx => {
                const row = [
                    $filter('date')(tx.date, 'yyyy-MM-dd'),
                    `"${tx.merchant.replace(/"/g, '""')}"`, // Handle quotes in merchant names
                    tx.category,
                    vm.getCardName(tx.cardId),
                    tx.amount.toFixed(2)
                ];
                csvRows.push(row.join(','));
            });

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        /**
         * Sets the selected transaction and shows the Bootstrap modal.
         */
        function showTransactionDetails(transaction) {
            vm.selectedTransaction = transaction;
            if (transactionModalInstance) {
                transactionModalInstance.show();
            }
        }
    }
})();
