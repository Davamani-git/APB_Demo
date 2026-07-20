/**
 * Controller for the main dashboard view.
 * This controller handles all the logic for data processing, metric calculation,
 * chart generation, and user interactions.
 * Adhering to the 'fat service, skinny controller' principle, complex business logic
 * should ideally be in services, but for this self-contained dashboard, some processing is done here.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', 'dataService', '$q', '$filter'];

    function DashboardController($scope, dataService, $q, $filter) {
        var vm = this;

        // --- ViewModel Initialization ---
        vm.isLoading = true;
        vm.isDarkMode = false;
        vm.cards = [];
        vm.transactions = [];
        vm.searchQuery = { text: '' };
        vm.metrics = {};
        vm.monthlySpend = {};
        vm.categorySpend = {};
        vm.topCategories = [];
        vm.topMerchants = [];
        vm.spendForecast = 0;
        vm.selectedTransaction = null;

        // --- Function bindings ---
        vm.toggleDarkMode = toggleDarkMode;
        vm.exportToCSV = exportToCSV;
        vm.showTransactionDetails = showTransactionDetails;
        vm.getCategoryClass = getCategoryClass;
        vm.getBootstrapColor = getBootstrapColor;

        // --- Modal instance ---
        var transactionModal = null;

        // --- Initialization Function ---
        activate();

        /**
         * The activation function to initialize the controller.
         * Fetches all necessary data and then processes it.
         */
        function activate() {
            // Using $q.all to wait for all data promises to resolve.
            // This is a robust pattern for handling multiple async startup operations.
            var promises = [dataService.getCards(), dataService.getTransactions()];

            $q.all(promises).then(function(results) {
                vm.cards = results[0];
                vm.transactions = results[1];

                // Once data is loaded, process it for the dashboard.
                calculateMetrics();
                processMonthlySpend();
                processCategorySpend();
                processTopSpendingCategories();
                processTopMerchants();
                calculateSpendForecast();

                // Initialize the Bootstrap modal instance after the DOM is ready
                var modalEl = document.getElementById('transactionDetailModal');
                if (modalEl) {
                    transactionModal = new bootstrap.Modal(modalEl);
                }

                vm.isLoading = false;
            });
        }

        // --- Data Processing Functions ---

        function calculateMetrics() {
            vm.metrics.totalOutstanding = vm.cards.reduce((sum, card) => sum + card.outstanding, 0);
            vm.metrics.totalAvailableCredit = vm.cards.reduce((sum, card) => sum + card.availableCredit, 0);
            vm.metrics.totalCreditLimit = vm.cards.reduce((sum, card) => sum + card.creditLimit, 0);
            vm.metrics.creditUtilization = (vm.metrics.totalOutstanding / vm.metrics.totalCreditLimit) * 100;
        }

        function processMonthlySpend() {
            var monthlyData = {};
            var today = new Date();
            var twelveMonthsAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);

            vm.transactions.forEach(tx => {
                var txDate = new Date(tx.date);
                if (txDate >= twelveMonthsAgo) {
                    var monthKey = txDate.getFullYear() + '-' + ('0' + (txDate.getMonth() + 1)).slice(-2);
                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = 0;
                    }
                    monthlyData[monthKey] += tx.amount;
                }
            });

            var sortedKeys = Object.keys(monthlyData).sort();
            vm.monthlySpend.labels = sortedKeys.map(key => {
                var parts = key.split('-');
                return new Date(parts[0], parts[1] - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
            });
            vm.monthlySpend.data = [sortedKeys.map(key => monthlyData[key].toFixed(2))];
            vm.monthlySpend.series = ['Expenditure'];
            vm.monthlySpend.options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) { return '€' + value; }
                        }
                    }]
                },
                elements: {
                    line: { tension: 0.4 }
                }
            };
        }

        function processCategorySpend() {
            var categoryData = {};
            vm.transactions.forEach(tx => {
                if (!categoryData[tx.category]) {
                    categoryData[tx.category] = 0;
                }
                categoryData[tx.category] += tx.amount;
            });

            vm.categorySpend.labels = Object.keys(categoryData);
            vm.categorySpend.data = Object.values(categoryData).map(v => v.toFixed(2));
            vm.categorySpend.colors = ['#fd7e14', '#20c997', '#dc3545', '#ffc107', '#6f42c1', '#0d6efd', '#198754', '#0dcaf0'];
            vm.categorySpend.options = {
                cutoutPercentage: 70,
                legend: { display: false }
            };
        }

        function processTopSpendingCategories() {
            var categoryData = {};
            vm.transactions.forEach(tx => {
                categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount;
            });
            vm.topCategories = Object.keys(categoryData).map(key => ({
                category: key,
                amount: categoryData[key]
            })).sort((a, b) => b.amount - a.amount);
        }

        function processTopMerchants() {
            var merchantData = {};
            vm.transactions.forEach(tx => {
                merchantData[tx.merchant] = (merchantData[tx.merchant] || 0) + tx.amount;
            });
            vm.topMerchants = Object.keys(merchantData).map(key => ({
                merchant: key,
                amount: merchantData[key]
            })).sort((a, b) => b.amount - a.amount);
        }

        function calculateSpendForecast() {
            var lastThreeMonthsSpend = 0;
            var count = 0;
            var today = new Date();
            for (var i = 1; i <= 3; i++) {
                var month = today.getMonth() - i;
                var year = today.getFullYear();
                if (month < 0) {
                    month += 12;
                    year -= 1;
                }
                var monthKey = year + '-' + ('0' + (month + 1)).slice(-2);
                var monthlyTotal = vm.monthlySpend.labels.reduce((total, label, index) => {
                    var labelDate = new Date(label.split(' ')[1], new Date(Date.parse(label.split(' ')[0] +" 1, 2012")).getMonth());
                    var labelKey = labelDate.getFullYear() + '-' + ('0' + (labelDate.getMonth() + 1)).slice(-2);
                    if (labelKey === monthKey) {
                        return total + parseFloat(vm.monthlySpend.data[0][index]);
                    }
                    return total;
                }, 0);

                if (monthlyTotal > 0) {
                    lastThreeMonthsSpend += monthlyTotal;
                    count++;
                }
            }
            vm.spendForecast = count > 0 ? lastThreeMonthsSpend / count : 0;
        }

        // --- UI Interaction Functions ---

        function toggleDarkMode() {
            // The ng-class on the body handles the CSS switching.
            // This function could be used to save the preference to localStorage.
            console.log('Dark Mode Toggled:', vm.isDarkMode);
        }

        function exportToCSV() {
            var filteredData = $filter('filter')(vm.transactions, vm.searchQuery.text);
            var csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Date,Merchant,Category,Amount,Card Name,Card Number\r\n';

            filteredData.forEach(function(tx) {
                var row = [
                    $filter('date')(tx.date, 'yyyy-MM-dd'),
                    '"' + tx.merchant + '"',
                    tx.category,
                    tx.amount,
                    tx.card.cardName,
                    tx.card.cardNumber // Masked number
                ].join(',');
                csvContent += row + '\r\n';
            });

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'transactions_export.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function showTransactionDetails(transaction) {
            vm.selectedTransaction = transaction;
            if (transactionModal) {
                transactionModal.show();
            }
        }

        // --- Utility Functions ---

        function getCategoryClass(category) {
            if (!category) return 'bg-other';
            var className = 'bg-' + category.toLowerCase().replace(/ /g, '-');
            return className;
        }

        function getBootstrapColor(index) {
            var colors = ['primary', 'success', 'info', 'warning', 'danger'];
            return colors[index % colors.length];
        }
    }
})();
