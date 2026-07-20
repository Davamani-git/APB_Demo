/**
 * Dashboard Controller
 * 
 * This controller is responsible for the logic of the main dashboard.
 * It fetches data from the dataService, processes it for display, and handles user interactions.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .controller('dashboardController', dashboardController);

    // Inject dependencies: $scope for data binding, dataService for data access, $timeout for simulating loading
    dashboardController.$inject = ['$scope', 'dataService', '$timeout', 'ChartJsProvider'];

    function dashboardController($scope, dataService, $timeout, ChartJsProvider) {

        // --- Scope Variable Initialization ---
        $scope.loading = true;
        $scope.darkMode = false;
        $scope.creditCards = [];
        $scope.transactions = [];
        $scope.sortKey = 'date';
        $scope.reverse = true;
        $scope.search = { merchant: '', cardId: '' };
        $scope.selectedTransaction = null;

        // Chart data models
        $scope.monthlySpend = { data: [], labels: [], series: ['Spend'] };
        $scope.categorySpend = { data: [], labels: [] };
        $scope.topMerchants = [];
        $scope.monthlySpendForecast = 0;

        // Chart.js options
        $scope.chartOptions = ChartJsProvider.getOptions();

        // --- Controller Initialization ---
        init();

        /**
         * Initialize the controller, fetch data, and process it.
         */
        function init() {
            // Simulate a network request delay
            $timeout(function() {
                $scope.creditCards = dataService.getCreditCards();
                $scope.transactions = dataService.getTransactions();
                
                // Process data for dashboard metrics and charts
                processDashboardData();

                $scope.loading = false;
            }, 1000);
        }

        // --- Data Processing Functions ---

        /**
         * Orchestrates the calculation of all dashboard metrics.
         */
        function processDashboardData() {
            calculateMonthlySpend();
            calculateCategorySpend();
            calculateTopMerchants();
            calculateMonthlySpendForecast();
        }

        /**
         * Calculates total spend for each of the last 12 months for the bar chart.
         */
        function calculateMonthlySpend() {
            const monthlyData = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            // Initialize last 12 months
            for (let i = 11; i >= 0; i--) {
                let d = new Date();
                d.setMonth(d.getMonth() - i);
                let monthKey = d.getFullYear() + '-' + (d.getMonth());
                let monthLabel = monthNames[d.getMonth()] + ' ' + d.getFullYear().toString().slice(-2);
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { total: 0, label: monthLabel };
                }
            }

            $scope.transactions.forEach(tx => {
                const txDate = new Date(tx.date);
                const monthKey = txDate.getFullYear() + '-' + txDate.getMonth();
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].total += tx.amount;
                }
            });

            const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a.split('-')[0], a.split('-')[1]) - new Date(b.split('-')[0], b.split('-')[1]));

            $scope.monthlySpend.labels = sortedMonths.map(key => monthlyData[key].label);
            $scope.monthlySpend.data = [sortedMonths.map(key => monthlyData[key].total.toFixed(2))];
        }

        /**
         * Aggregates transaction amounts by category for the doughnut chart.
         */
        function calculateCategorySpend() {
            const categoryData = {};
            $scope.transactions.forEach(tx => {
                categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount;
            });

            const sortedCategories = Object.keys(categoryData).sort((a, b) => categoryData[b] - categoryData[a]);
            
            $scope.categorySpend.labels = sortedCategories;
            $scope.categorySpend.data = sortedCategories.map(cat => categoryData[cat].toFixed(2));
        }

        /**
         * Calculates the top 5 merchants by spending.
         */
        function calculateTopMerchants() {
            const merchantData = {};
            $scope.transactions.forEach(tx => {
                merchantData[tx.merchant] = (merchantData[tx.merchant] || 0) + tx.amount;
            });

            $scope.topMerchants = Object.keys(merchantData)
                .map(name => ({ name: name, amount: merchantData[name] }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);
        }

        /**
         * Calculates a simple spend forecast for the current month.
         */
        function calculateMonthlySpendForecast() {
            const lastThreeMonths = $scope.monthlySpend.data[0].slice(-4, -1); // Get spend from M-3, M-2, M-1
            if (lastThreeMonths.length < 3) {
                $scope.monthlySpendForecast = 0;
                return;
            }
            const average = lastThreeMonths.reduce((acc, val) => acc + parseFloat(val), 0) / 3;
            $scope.monthlySpendForecast = average;
        }

        // --- Scope Functions (for View interaction) ---

        /**
         * Toggles between light and dark mode.
         */
        $scope.toggleDarkMode = function() {
            $scope.darkMode = !$scope.darkMode;
            const fontColor = $scope.darkMode ? '#e0e0e0' : '#666';
            const gridColor = $scope.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            
            // Update chart options for the new theme
            ChartJsProvider.setOptions({
                legend: { labels: { fontColor: fontColor } },
                scales: {
                    yAxes: [{ ticks: { fontColor: fontColor }, gridLines: { color: gridColor } }],
                    xAxes: [{ ticks: { fontColor: fontColor }, gridLines: { display: false } }]
                }
            });
            $scope.chartOptions = ChartJsProvider.getOptions();
        };

        /**
         * Sorts the transaction table by a given key.
         * @param {string} key - The key to sort by (e.g., 'date', 'amount').
         */
        $scope.sort = function(key) {
            $scope.sortKey = key;
            $scope.reverse = !$scope.reverse;
        };

        /**
         * Exports the currently filtered transactions to a CSV file.
         */
        $scope.exportToCsv = function() {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Date,Merchant,Category,Amount,Card\n";

            const filteredTxs = $scope.$eval("transactions | filter:search | orderBy:sortKey:reverse");

            filteredTxs.forEach(function(tx) {
                let row = [tx.date.substring(0, 10), tx.merchant, tx.category, tx.amount, $scope.getCardName(tx.cardId)].join(",");
                csvContent += row + "\r\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "transactions.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        /**
         * Sets the selected transaction and shows the detail modal.
         * @param {object} tx - The transaction object to display.
         */
        $scope.showTransactionDetails = function(tx) {
            $scope.selectedTransaction = tx;
            var transactionModal = new bootstrap.Modal(document.getElementById('transactionModal'));
            transactionModal.show();
        };

        // --- Utility Functions ---

        $scope.getCardName = function(cardId) {
            const card = $scope.creditCards.find(c => c.id === cardId);
            return card ? card.cardName : 'N/A';
        };

        $scope.getCardNumber = function(cardId) {
            const card = $scope.creditCards.find(c => c.id === cardId);
            return card ? card.cardNumber : 'N/A';
        };

        $scope.getCategoryClass = function(category) {
            return category.toLowerCase().replace(' ', '-');
        };
    }
})();