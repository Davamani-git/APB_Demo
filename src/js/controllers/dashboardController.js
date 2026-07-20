/**
 * Dashboard Controller
 * This is the main controller for the dashboard view. It orchestrates the UI by:
 * - Fetching data from the dataService.
 * - Performing calculations for summary metrics.
 * - Preparing data for charts.
 * - Handling user interactions like filtering, sorting, and modal popups.
 */
(function() {
    'use strict';

    angular.module('creditCardDashboardApp')
        .controller('dashboardController', ['dataService', '$filter', function(dataService, $filter) {
            var vm = this; // Using 'controller as' syntax for a cleaner scope

            // --- Initialization --- //
            vm.loading = true;
            vm.cards = [];
            vm.transactions = [];
            vm.summary = {};
            vm.filters = { merchant: '', category: '', cardId: '' };
            vm.sortKey = 'date';
            vm.sortReverse = true;
            vm.darkMode = false;
            vm.modalInstance = null;

            // Chart data initialization
            vm.charts = {
                category: { labels: [], data: [] },
                trend: { labels: [], data: [], series: ['Spend'] },
                card: { labels: [], data: [] },
                options: { // Specific options for Chart.js 2.9.4
                    legend: { display: true, position: 'bottom', labels: { fontColor: '#666' } },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var total = dataset.data.reduce(function(previousValue, currentValue) { return previousValue + currentValue; });
                                var currentValue = dataset.data[tooltipItem.index];
                                var percentage = Math.floor(((currentValue/total) * 100)+0.5);
                                return ' ' + data.labels[tooltipItem.index] + ': ' + $filter('inrCurrency')(currentValue) + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            };

            // --- Data Loading Function --- //
            function activate() {
                // Use $q.all to wait for all data promises to resolve
                var promises = [dataService.getCreditCards(), dataService.getTransactions()];
                Promise.all(promises).then(function(results) {
                    vm.cards = results[0];
                    vm.transactions = results[1];

                    // Once data is loaded, perform all calculations
                    calculateSummaryMetrics();
                    prepareChartData();
                    performAdvancedAnalysis();
                    extractUniqueFilters();
                    
                    vm.loading = false;
                });
            }

            activate(); // Initial load

            // --- Metric Calculation Functions --- //
            function calculateSummaryMetrics() {
                vm.summary.totalCreditLimit = vm.cards.reduce((sum, card) => sum + card.creditLimit, 0);
                vm.summary.totalAvailableCredit = vm.cards.reduce((sum, card) => sum + card.availableCredit, 0);
                vm.summary.totalOutstanding = vm.cards.reduce((sum, card) => sum + card.outstanding, 0);
                vm.summary.utilizationPercentage = (vm.summary.totalOutstanding / vm.summary.totalCreditLimit) * 100;

                const now = new Date();
                const currentMonthTxs = vm.transactions.filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
                });

                vm.summary.totalMonthlySpend = currentMonthTxs.reduce((sum, tx) => sum + tx.amount, 0);
                vm.summary.numTransactions = currentMonthTxs.length;
            }

            // --- Chart Data Preparation --- //
            function prepareChartData() {
                // Category-wise Spending (Doughnut Chart)
                const categorySpend = vm.transactions.reduce((acc, tx) => {
                    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                    return acc;
                }, {});
                vm.charts.category.labels = Object.keys(categorySpend);
                vm.charts.category.data = Object.values(categorySpend);

                // Card-wise Spending (Pie Chart)
                const cardSpend = vm.transactions.reduce((acc, tx) => {
                    const cardName = vm.getCardById(tx.cardId).cardName;
                    acc[cardName] = (acc[cardName] || 0) + tx.amount;
                    return acc;
                }, {});
                vm.charts.card.labels = Object.keys(cardSpend);
                vm.charts.card.data = Object.values(cardSpend);

                // Monthly Spending Trend (Bar Chart)
                const monthlySpend = {};
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                for (let i = 11; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const monthKey = monthNames[d.getMonth()] + ' ' + d.getFullYear().toString().substr(-2);
                    monthlySpend[monthKey] = 0;
                }
                vm.transactions.forEach(tx => {
                    const txDate = new Date(tx.date);
                    const monthKey = monthNames[txDate.getMonth()] + ' ' + txDate.getFullYear().toString().substr(-2);
                    if (monthlySpend.hasOwnProperty(monthKey)) {
                        monthlySpend[monthKey] += tx.amount;
                    }
                });
                vm.charts.trend.labels = Object.keys(monthlySpend);
                vm.charts.trend.data = [Object.values(monthlySpend)];
            }

            // --- Advanced Analysis & Extra Features --- //
            function performAdvancedAnalysis() {
                // Monthly Spend Forecast
                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const currentDay = now.getDate();
                const forecast = (vm.summary.totalMonthlySpend / currentDay) * daysInMonth;
                vm.forecast = { monthly: forecast };

                // Top 5 Spending Categories
                const categorySpend = vm.transactions.reduce((acc, tx) => {
                    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                    return acc;
                }, {});
                vm.analysis = {};
                vm.analysis.topCategories = Object.entries(categorySpend)
                    .map(([category, amount]) => ({ category, amount }))
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5);

                // Top 5 Merchants
                const merchantSpend = vm.transactions.reduce((acc, tx) => {
                    acc[tx.merchant] = (acc[tx.merchant] || 0) + tx.amount;
                    return acc;
                }, {});
                vm.analysis.topMerchants = Object.entries(merchantSpend)
                    .map(([merchant, amount]) => ({ merchant, amount }))
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5);
            }

            // --- UI Interaction Functions --- //

            vm.setSort = function(key) {
                if (vm.sortKey === key) {
                    vm.sortReverse = !vm.sortReverse;
                } else {
                    vm.sortKey = key;
                    vm.sortReverse = false;
                }
            };

            vm.getSortIcon = function(key) {
                if (vm.sortKey === key) {
                    return vm.sortReverse ? 'fa-sort-down' : 'fa-sort-up';
                }
                return 'fa-sort';
            };

            vm.toggleDarkMode = function() {
                document.body.classList.toggle('dark-mode', vm.darkMode);
                // Update chart colors for dark mode
                const fontColor = vm.darkMode ? '#e0e0e0' : '#666';
                vm.charts.options.legend.labels.fontColor = fontColor;
                // This is a limitation of angular-chart.js with Chart.js 2.x, charts need a redraw to update options.
                // For simplicity, we are just updating the config for future redraws.
            };

            vm.showTransactionDetails = function(transaction) {
                vm.selectedTransaction = transaction;
                if (!vm.modalInstance) {
                    var modalEl = document.getElementById('transactionDetailModal');
                    vm.modalInstance = new bootstrap.Modal(modalEl);
                }
                vm.modalInstance.show();
            };

            vm.exportToCsv = function() {
                const filteredTxs = $filter('orderBy')($filter('filter')(vm.transactions, {merchant: vm.filters.merchant, category: vm.filters.category, cardId: vm.filters.cardId}), vm.sortKey, vm.sortReverse);
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Date,Merchant,Category,Amount,Card\r\n";

                filteredTxs.forEach(tx => {
                    let row = [
                        $filter('date')(tx.date, 'yyyy-MM-dd'),
                        tx.merchant,
                        tx.category,
                        tx.amount,
                        vm.getCardById(tx.cardId).cardName
                    ].join(',');
                    csvContent += row + "\r\n";
                });

                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "transactions.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            // --- Utility Functions --- //

            vm.getCardById = function(cardId) {
                return vm.cards.find(card => card.id === cardId) || {};
            };

            function extractUniqueFilters() {
                vm.uniqueCategories = [...new Set(vm.transactions.map(tx => tx.category))].sort();
            }

        }]);
})();