/**
 * Dashboard Controller
 * Handles all the logic for the main dashboard view.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .controller('DashboardController', DashboardController);

    // Inject dependencies
    DashboardController.$inject = ['$scope', 'dataService', '$filter', '$timeout', 'ChartJsProvider'];

    function DashboardController($scope, dataService, $filter, $timeout, ChartJsProvider) {
        // ViewModel
        var vm = $scope;

        // --- SCOPE VARIABLE INITIALIZATION ---
        vm.loading = true;
        vm.darkMode = false;
        vm.cards = [];
        vm.transactions = [];
        vm.summary = {};
        vm.filters = { searchText: '', category: '', cardId: '' };
        vm.sortKey = 'date';
        vm.reverse = true;
        vm.selectedTransaction = null;

        // Chart data models
        vm.categoryChart = {};
        vm.monthlyTrendChart = {};

        // --- FUNCTION BINDINGS ---
        vm.init = init;
        vm.toggleDarkMode = toggleDarkMode;
        vm.calculateDashboardMetrics = calculateDashboardMetrics;
        vm.prepareCategorySpendChart = prepareCategorySpendChart;
        vm.prepareMonthlyTrendChart = prepareMonthlyTrendChart;
        vm.sort = sort;
        vm.showTransactionDetails = showTransactionDetails;
        vm.getCardName = getCardName;
        vm.exportToCSV = exportToCSV;
        vm.getCategoryClass = getCategoryClass;

        // --- INITIALIZATION ---
        vm.init();

        // --- FUNCTION DEFINITIONS ---

        /**
         * Initializes the controller, fetches data, and sets up the dashboard.
         */
        function init() {
            vm.loading = true;
            // Fetch data from the service
            var cardPromise = dataService.getCards();
            var transactionPromise = dataService.getTransactions();

            // Use Promise.all to wait for both data sets
            Promise.all([cardPromise, transactionPromise]).then(function(results) {
                vm.cards = results[0];
                vm.transactions = results[1];

                // Process data once fetched
                vm.calculateDashboardMetrics();
                vm.prepareCategorySpendChart();
                vm.prepareMonthlyTrendChart();
                
                // Extract unique categories for the filter dropdown
                vm.uniqueCategories = [...new Set(vm.transactions.map(tx => tx.category))].sort();

                // Use $timeout to ensure the digest cycle runs after promise resolution
                $timeout(function() {
                    vm.loading = false;
                }, 500); // Simulate a slight delay for a smoother transition
            });
        }

        /**
         * Calculates all summary metrics for the top dashboard cards.
         */
        function calculateDashboardMetrics() {
            // Card-related summaries
            vm.summary.totalCreditLimit = vm.cards.reduce((sum, card) => sum + card.creditLimit, 0);
            vm.summary.totalAvailableCredit = vm.cards.reduce((sum, card) => sum + card.availableCredit, 0);
            vm.summary.totalOutstanding = vm.cards.reduce((sum, card) => sum + card.outstanding, 0);
            vm.summary.overallUtilization = (vm.summary.totalOutstanding / vm.summary.totalCreditLimit) * 100 || 0;

            // Transaction-related summaries for the current month
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthlyTransactions = vm.transactions.filter(tx => new Date(tx.date) >= firstDayOfMonth);

            vm.summary.totalMonthlySpend = monthlyTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            vm.summary.monthlyTransactionsCount = monthlyTransactions.length;
            
            // Monthly Spend Forecast (simple linear projection)
            const dayOfMonth = now.getDate();
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            vm.summary.forecastedSpend = (vm.summary.totalMonthlySpend / dayOfMonth) * daysInMonth || 0;
        }

        /**
         * Aggregates transaction data by category for the doughnut chart.
         */
        function prepareCategorySpendChart() {
            const categorySpend = {};
            vm.transactions.forEach(tx => {
                categorySpend[tx.category] = (categorySpend[tx.category] || 0) + tx.amount;
            });

            const sortedCategories = Object.keys(categorySpend).sort((a, b) => categorySpend[b] - categorySpend[a]);

            vm.categoryChart.labels = sortedCategories;
            vm.categoryChart.data = sortedCategories.map(cat => categorySpend[cat]);
            vm.categoryChart.options = { legend: { display: false } }; // Hide legend for a cleaner look
            
            // For Top 5 Categories list
            vm.topCategories = sortedCategories.map(cat => ({ category: cat, amount: categorySpend[cat] }));
        }

        /**
         * Aggregates transaction data by month for the bar chart.
         */
        function prepareMonthlyTrendChart() {
            const monthlySpend = {};
            const monthLabels = [];
            const now = new Date();

            // Initialize last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthKey = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().slice(-2);
                monthLabels.push(monthKey);
                monthlySpend[monthKey] = 0;
            }

            vm.transactions.forEach(tx => {
                const txDate = new Date(tx.date);
                const monthKey = txDate.toLocaleString('default', { month: 'short' }) + ' ' + txDate.getFullYear().toString().slice(-2);
                if (monthlySpend.hasOwnProperty(monthKey)) {
                    monthlySpend[monthKey] += tx.amount;
                }
            });

            vm.monthlyTrendChart.labels = monthLabels;
            vm.monthlyTrendChart.series = ['Spend'];
            vm.monthlyTrendChart.data = [monthLabels.map(label => monthlySpend[label])];
            vm.monthlyTrendChart.options = { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } };
            
            // For Top 5 Merchants list
            const merchantSpend = {};
            vm.transactions.forEach(tx => {
                merchantSpend[tx.merchant] = (merchantSpend[tx.merchant] || 0) + tx.amount;
            });
            vm.topMerchants = Object.keys(merchantSpend)
                .map(merch => ({ merchant: merch, amount: merchantSpend[merch] }))
                .sort((a, b) => b.amount - a.amount);
        }

        /**
         * Toggles dark mode and updates chart colors.
         */
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode', vm.darkMode);
            const newColor = vm.darkMode ? '#dee2e6' : '#6c757d';
            ChartJsProvider.setOptions({
                legend: { labels: { fontColor: newColor } },
                scales: {
                    yAxes: [{ ticks: { fontColor: newColor }, gridLines: { color: 'rgba(255, 255, 255, 0.1)' } }],
                    xAxes: [{ ticks: { fontColor: newColor }, gridLines: { color: 'rgba(255, 255, 255, 0.1)' } }]
                }
            });
        }

        /**
         * Sets the sorting key and direction for the transaction table.
         * @param {string} key - The key to sort by (e.g., 'date', 'amount').
         */
        function sort(key) {
            vm.sortKey = key;
            vm.reverse = !vm.reverse;
        }

        /**
         * Sets the selected transaction for the modal view.
         * @param {object} transaction - The transaction object to display.
         */
        function showTransactionDetails(transaction) {
            vm.selectedTransaction = transaction;
        }

        /**
         * Retrieves the card name from its ID.
         * @param {number} cardId - The ID of the card.
         * @returns {string} The name of the card.
         */
        function getCardName(cardId) {
            const card = vm.cards.find(c => c.id === cardId);
            return card ? card.cardName : 'Unknown Card';
        }
        
        /**
         * Returns a dynamic CSS class for category badges.
         * @param {string} category - The category name.
         * @returns {string} The CSS class name.
         */
        function getCategoryClass(category) {
            const sanitizedCategory = category.split(' ')[0].toLowerCase();
            return `bg-category-${sanitizedCategory}`;
        }

        /**
         * Exports the currently filtered transactions to a CSV file.
         */
        function exportToCSV() {
            const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Card'];
            const filteredData = $filter('orderBy')( 
                                $filter('filter')(vm.transactions, {merchant: vm.filters.searchText}), 
                                vm.sortKey, 
                                vm.reverse
                               );

            let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

            filteredData.forEach(function(tx) {
                const row = [
                    $filter('date')(tx.date, 'yyyy-MM-dd'),
                    `"${tx.merchant}"`, // Enclose in quotes to handle commas
                    tx.category,
                    tx.amount,
                    getCardName(tx.cardId)
                ];
                csvContent += row.join(',') + '\n';
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
})();
