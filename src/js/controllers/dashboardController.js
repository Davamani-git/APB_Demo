/**
 * Dashboard Controller
 * Role: Acts as the Controller in the MVC architecture.
 * Responsibility: Manages the state and logic for the main dashboard view.
 * It fetches data from services, performs calculations for display, handles user interactions (filtering, sorting),
 * and prepares data for visualization components (charts).
 */

(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp.controllers')
        .controller('DashboardController', DashboardController);

    // Dependency Injection: Explicitly listing dependencies is a best practice for minification safety.
    DashboardController.$inject = ['$scope', '$q', 'dataService', 'auditService', '$filter', '$timeout'];

    function DashboardController($scope, $q, dataService, auditService, $filter, $timeout) {

        // --- Scope Variable Initialization ---
        $scope.isLoading = true;
        $scope.isDarkMode = false;
        $scope.cards = [];
        $scope.transactions = [];
        $scope.filteredTransactions = [];
        $scope.metrics = {};
        $scope.filters = { searchText: '', category: '', cardId: '', bank: '' };
        $scope.filterOptions = { categories: [], banks: [] };
        $scope.sortType = 'date';
        $scope.sortReverse = true;
        $scope.selectedTransaction = null;
        var transactionDetailModal = null;

        // --- Chart Data Initialization ---
        $scope.categorySpendChart = { labels: [], data: [], options: { legend: { display: true, position: 'right' } } };
        $scope.monthlySpendChart = { labels: [], data: [[]], series: ['Spend'], options: { scales: { yAxes: [{ ticks: { beginAtZero: true, callback: function(value) { return '€' + value; } } }] } } };
        $scope.cardSpendChart = { labels: [], data: [] };

        // --- Scope Function Definitions ---
        $scope.applyFilters = applyFilters;
        $scope.sortBy = sortBy;
        $scope.getSortIcon = getSortIcon;
        $scope.getCardById = getCardById;
        $scope.getCategoryBadge = getCategoryBadge;
        $scope.toggleDarkMode = toggleDarkMode;
        $scope.exportToCSV = exportToCSV;
        $scope.showTransactionDetails = showTransactionDetails;

        // --- Initialization Function ---
        function init() {
            auditService.log('Dashboard Initialized');
            var promises = {
                cards: dataService.getCards(),
                transactions: dataService.getTransactions()
            };

            $q.all(promises).then(function(results) {
                $scope.cards = results.cards;
                $scope.transactions = results.transactions;
                
                // Once data is loaded, process it
                processData();
                
                // Hide loader
                $scope.isLoading = false;

                // Initialize Bootstrap components that require JS
                $timeout(function() {
                    transactionDetailModal = new bootstrap.Modal(document.getElementById('transactionDetailModal'));
                });
            });
        }

        function processData() {
            applyFilters();
            calculateMetrics();
            prepareFilterOptions();
            prepareChartData();
            calculateInsights();
        }

        function calculateMetrics() {
            $scope.metrics.totalCreditLimit = $scope.cards.reduce((sum, card) => sum + card.creditLimit, 0);
            $scope.metrics.totalOutstanding = $scope.cards.reduce((sum, card) => sum + card.outstanding, 0);
            $scope.metrics.totalAvailableCredit = $scope.metrics.totalCreditLimit - $scope.metrics.totalOutstanding;
            $scope.metrics.totalUtilization = $scope.metrics.totalCreditLimit > 0 ? ($scope.metrics.totalOutstanding / $scope.metrics.totalCreditLimit) * 100 : 0;

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            $scope.metrics.currentMonthSpend = $scope.transactions
                .filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
                })
                .reduce((sum, tx) => sum + tx.amount, 0);
        }

        function prepareFilterOptions() {
            const categories = new Set($scope.transactions.map(tx => tx.category));
            const banks = new Set($scope.cards.map(card => card.bank));
            $scope.filterOptions.categories = Array.from(categories).sort();
            $scope.filterOptions.banks = Array.from(banks).sort();
        }

        function applyFilters() {
            let tempTransactions = $filter('filter')($scope.transactions, { merchant: $scope.filters.searchText });
            if ($scope.filters.category) {
                tempTransactions = $filter('filter')(tempTransactions, { category: $scope.filters.category });
            }
            if ($scope.filters.cardId) {
                tempTransactions = $filter('filter')(tempTransactions, { cardId: $scope.filters.cardId });
            }
            if ($scope.filters.bank) {
                const cardIdsForBank = $scope.cards.filter(c => c.bank === $scope.filters.bank).map(c => c.id);
                tempTransactions = tempTransactions.filter(tx => cardIdsForBank.includes(tx.cardId));
            }
            $scope.filteredTransactions = tempTransactions;
        }

        function sortBy(newSortType) {
            if ($scope.sortType === newSortType) {
                $scope.sortReverse = !$scope.sortReverse;
            } else {
                $scope.sortType = newSortType;
                $scope.sortReverse = false;
            }
        }

        function getSortIcon(column) {
            if ($scope.sortType !== column) return 'fa-sort';
            return $scope.sortReverse ? 'fa-sort-down' : 'fa-sort-up';
        }

        function getCardById(cardId) {
            return $scope.cards.find(card => card.id === cardId) || {};
        }

        function getCategoryBadge(category) {
            const slug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            return `bg-${slug}`;
        }

        function toggleDarkMode() {
            $scope.isDarkMode = !$scope.isDarkMode;
            document.body.classList.toggle('dark-mode', $scope.isDarkMode);
            auditService.log('Dark Mode Toggled', { enabled: $scope.isDarkMode });
            // This is a workaround to get charts to redraw with new colors if needed.
            // For this demo, CSS handles it, but in complex cases, a redraw is necessary.
        }

        function prepareChartData() {
            // Category Spend (Doughnut)
            const categorySpend = $scope.transactions.reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
            }, {});
            $scope.categorySpendChart.labels = Object.keys(categorySpend);
            $scope.categorySpendChart.data = Object.values(categorySpend).map(v => v.toFixed(2));

            // Monthly Spend (Bar)
            const monthlySpend = {};
            const monthLabels = [];
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthKey = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0');
                monthLabels.push($filter('date')(d, 'MMM yyyy'));
                monthlySpend[monthKey] = 0;
            }
            $scope.transactions.forEach(tx => {
                const txDate = new Date(tx.date);
                const monthKey = txDate.getFullYear() + '-' + (txDate.getMonth() + 1).toString().padStart(2, '0');
                if (monthlySpend.hasOwnProperty(monthKey)) {
                    monthlySpend[monthKey] += tx.amount;
                }
            });
            $scope.monthlySpendChart.labels = monthLabels;
            $scope.monthlySpendChart.data[0] = Object.values(monthlySpend).map(v => v.toFixed(2));

            // Card Spend (Pie)
            const cardSpend = $scope.transactions.reduce((acc, tx) => {
                const cardName = getCardById(tx.cardId).cardName || 'Unknown Card';
                acc[cardName] = (acc[cardName] || 0) + tx.amount;
                return acc;
            }, {});
            $scope.cardSpendChart.labels = Object.keys(cardSpend);
            $scope.cardSpendChart.data = Object.values(cardSpend).map(v => v.toFixed(2));
        }

        function calculateInsights() {
            // Monthly Spend Forecast
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const dayOfMonth = today.getDate();
            $scope.spendForecast = dayOfMonth > 0 ? ($scope.metrics.currentMonthSpend / dayOfMonth) * daysInMonth : 0;

            // Top Categories & Merchants
            const categoryTotals = $scope.transactions.reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
            }, {});
            $scope.topCategories = Object.entries(categoryTotals)
                .map(([name, amount]) => ({ name, amount }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);

            const merchantTotals = $scope.transactions.reduce((acc, tx) => {
                acc[tx.merchant] = (acc[tx.merchant] || 0) + tx.amount;
                return acc;
            }, {});
            $scope.topMerchants = Object.entries(merchantTotals)
                .map(([name, amount]) => ({ name, amount }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);
        }

        function exportToCSV() {
            auditService.log('Transaction Data Exported', { filterCriteria: $scope.filters });
            let csvContent = "data:text/csv;charset=utf-8,";
            const headers = ["Date", "Merchant", "Category", "CardName", "CardNumber", "Amount"];
            csvContent += headers.join(",") + "\r\n";

            $scope.filteredTransactions.forEach(function(tx) {
                const card = getCardById(tx.cardId);
                const row = [
                    $filter('date')(tx.date, 'yyyy-MM-dd'),
                    `"${tx.merchant}"`,
                    tx.category,
                    card.cardName,
                    card.cardNumber, // Masked number
                    tx.amount
                ];
                csvContent += row.join(",") + "\r\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "transactions.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function showTransactionDetails(transaction) {
            $scope.selectedTransaction = transaction;
            if (transactionDetailModal) {
                transactionDetailModal.show();
            }
        }

        // --- Run initialization logic ---
        init();
    }
})();