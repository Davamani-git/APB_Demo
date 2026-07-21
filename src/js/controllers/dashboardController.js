/*
Senior UI Engineer With PCI-DSS Compliance Expertise
Project: Credit Card Expenditure Dashboard
File: js/controllers/dashboardController.js
Description: Controller for the main dashboard view. Handles all business logic.
*/

(function() {
    'use strict';

    angular.module('creditCardDashboardApp').controller('DashboardController', DashboardController);

    // Dependency Injection
    DashboardController.$inject = ['$scope', 'dataService', '$timeout'];

    function DashboardController($scope, dataService, $timeout) {

        // --- Scope Variable Initialization ---
        $scope.loading = true;
        $scope.isDarkMode = false;
        $scope.cards = [];
        $scope.transactions = [];
        $scope.totalMetrics = { outstanding: 0, availableCredit: 0, creditLimit: 0 };
        $scope.monthlyForecast = 0;
        $scope.selectedTransaction = null;
        var transactionModal = null;

        // Chart data models
        $scope.monthlySpend = { labels: [], data: [], series: ['Spend'] };
        $scope.categorySpend = { labels: [], data: [] };
        $scope.merchantSpend = { labels: [], data: [[]] };

        // Chart.js v2.9.4 options
        $scope.chartOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                 xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        // --- Controller Functions ---

        /**
         * Initializes the controller, fetches data, and sets up the dashboard.
         */
        function init() {
            // Simulate API call latency
            $timeout(function() {
                $scope.cards = dataService.getCreditCards();
                $scope.transactions = dataService.getTransactions();

                calculateTotalMetrics();
                prepareMonthlySpendChart();
                prepareCategorySpendChart();
                prepareMerchantSpendChart();
                calculateMonthlyForecast();

                $scope.loading = false;
                // Initialize Bootstrap modal instance after view is loaded
                $timeout(function() {
                    var modalEl = document.getElementById('transactionModal');
                    if (modalEl) {
                       transactionModal = new bootstrap.Modal(modalEl);
                    }
                });
            }, 1500);
        }

        /**
         * Calculates aggregate metrics across all credit cards.
         */
        function calculateTotalMetrics() {
            $scope.totalMetrics = $scope.cards.reduce(function(acc, card) {
                acc.outstanding += card.outstanding;
                acc.availableCredit += card.availableCredit;
                acc.creditLimit += card.creditLimit;
                return acc;
            }, { outstanding: 0, availableCredit: 0, creditLimit: 0 });
        }

        /**
         * Prepares data for the monthly spending bar chart.
         */
        function prepareMonthlySpendChart() {
            var monthLabels = [];
            var monthData = [];
            var monthlyTotals = {};

            for (var i = 11; i >= 0; i--) {
                var d = new Date();
                d.setMonth(d.getMonth() - i);
                var monthKey = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0');
                monthLabels.push(d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().substr(-2));
                monthlyTotals[monthKey] = 0;
            }

            $scope.transactions.forEach(function(tx) {
                var txDate = new Date(tx.date);
                var txMonthKey = txDate.getFullYear() + '-' + (txDate.getMonth() + 1).toString().padStart(2, '0');
                if (monthlyTotals.hasOwnProperty(txMonthKey)) {
                    monthlyTotals[txMonthKey] += tx.amount;
                }
            });

            for (var key in monthlyTotals) {
                monthData.push(monthlyTotals[key].toFixed(2));
            }

            $scope.monthlySpend.labels = monthLabels;
            $scope.monthlySpend.data = [monthData];
        }

        /**
         * Prepares data for the top spending categories doughnut chart.
         */
        function prepareCategorySpendChart() {
            var categoryTotals = {};
            $scope.transactions.forEach(function(tx) {
                if (!categoryTotals[tx.category]) {
                    categoryTotals[tx.category] = 0;
                }
                categoryTotals[tx.category] += tx.amount;
            });

            var sortedCategories = Object.keys(categoryTotals).sort(function(a, b) {
                return categoryTotals[b] - categoryTotals[a];
            });

            $scope.categorySpend.labels = sortedCategories;
            $scope.categorySpend.data = sortedCategories.map(function(cat) {
                return categoryTotals[cat].toFixed(2);
            });
        }

        /**
         * Prepares data for the top merchants horizontal bar chart.
         */
        function prepareMerchantSpendChart() {
            var merchantTotals = {};
            $scope.transactions.forEach(function(tx) {
                if (!merchantTotals[tx.merchant]) {
                    merchantTotals[tx.merchant] = 0;
                }
                merchantTotals[tx.merchant] += tx.amount;
            });

            var sortedMerchants = Object.keys(merchantTotals).sort(function(a, b) {
                return merchantTotals[b] - merchantTotals[a];
            }).slice(0, 10); // Top 10

            $scope.merchantSpend.labels = sortedMerchants.reverse(); // Reverse for horizontal bar chart
            $scope.merchantSpend.data = [sortedMerchants.map(function(merch) {
                return merchantTotals[merch].toFixed(2);
            })];
        }

        /**
         * Calculates a simple spending forecast for the current month.
         */
        function calculateMonthlyForecast() {
            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            var dayOfMonth = today.getDate();

            var spendThisMonth = 0;
            $scope.transactions.forEach(function(tx) {
                var txDate = new Date(tx.date);
                if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                    spendThisMonth += tx.amount;
                }
            });

            if (dayOfMonth > 0) {
                var avgDailySpend = spendThisMonth / dayOfMonth;
                $scope.monthlyForecast = spendThisMonth + (avgDailySpend * (daysInMonth - dayOfMonth));
            } else {
                $scope.monthlyForecast = 0;
            }
        }

        /**
         * Toggles between light and dark mode.
         */
        $scope.toggleDarkMode = function() {
            // This is handled by ng-class on the body tag.
            // This function is here for the ng-change, but logic is in the view.
        };

        /**
         * Exports the current transaction list to a CSV file.
         */
        $scope.exportToCSV = function() {
            var csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Transaction ID,Date,Merchant,Category,Amount,Card\n';

            $scope.transactions.forEach(function(tx) {
                var cardName = $scope.getCardName(tx.cardId).replace(',', '');
                var row = [tx.id, new Date(tx.date).toISOString(), tx.merchant, tx.category, tx.amount, cardName].join(',');
                csvContent += row + '\n';
            });

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        /**
         * Displays the transaction detail modal.
         * @param {object} transaction - The transaction to display.
         */
        $scope.showTransactionDetails = function(transaction) {
            $scope.selectedTransaction = transaction;
            if (transactionModal) {
                transactionModal.show();
            }
        };

        // --- Utility Functions for the View ---
        $scope.getCardName = function(cardId) {
            var card = $scope.cards.find(c => c.id === cardId);
            return card ? card.cardName : 'N/A';
        };

        $scope.getCardNumber = function(cardId) {
            var card = $scope.cards.find(c => c.id === cardId);
            return card ? card.cardNumber : 'N/A';
        };

        $scope.getCategoryClass = function(category) {
            var colors = {
                'Groceries': 'bg-success',
                'Shopping': 'bg-primary',
                'Food Delivery': 'bg-danger',
                'Travel': 'bg-info',
                'Electronics': 'bg-secondary',
                'Entertainment': 'bg-warning',
                'Health': 'bg-dark',
                'Transport': 'bg-primary'
            };
            return colors[category] || 'bg-light text-dark';
        };

        // --- Run Initialization ---
        init();
    }
})();
