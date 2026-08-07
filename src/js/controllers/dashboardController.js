/*
File: dashboardController.js
Description: AngularJS controller for the dashboard logic.
Author: Senior UI Engineer
Date: 2024-07-25
*/

app.controller('dashboardController', ['$scope', 'dataService', '$timeout', function($scope, dataService, $timeout) {

    // --- Initialization ---
    function init() {
        $scope.loading = true;
        $scope.creditCards = [];
        $scope.transactions = [];
        $scope.dashboardMetrics = {};
        $scope.filters = { merchant: '', category: '', cardId: '' };
        $scope.sortKey = 'date';
        $scope.reverse = true;
        $scope.darkMode = false;
        $scope.selectedTransaction = null;

        // Pagination
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalPages = 0;

        // Chart data holders
        $scope.categorySpend = {};
        $scope.cardSpend = {};
        $scope.monthlyTrend = {};
        $scope.chartOptions = {
            legend: { labels: { fontColor: $scope.darkMode ? '#e0e0e0' : '#666' } }
        };

        // Fetch data from the service
        dataService.getCreditCards().then(function(cards) {
            $scope.creditCards = cards;
            dataService.getTransactions().then(function(txs) {
                $scope.transactions = txs;
                // Once all data is loaded, process it
                processDashboardData();
                $scope.loading = false;
            });
        });
    }

    // --- Data Processing ---
    function processDashboardData() {
        calculateDashboardMetrics();
        prepareChartData();
        prepareExtraFeatures();
        updateTransactionCategories();
        updatePagination();
    }

    function calculateDashboardMetrics() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        $scope.dashboardMetrics.totalSpend = $scope.transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && tx.status === 'Completed';
            })
            .reduce((sum, tx) => sum + tx.amount, 0);

        $scope.dashboardMetrics.totalCreditLimit = $scope.creditCards.reduce((sum, card) => sum + card.creditLimit, 0);
        $scope.dashboardMetrics.totalAvailableCredit = $scope.creditCards.reduce((sum, card) => sum + card.availableCredit, 0);
        $scope.dashboardMetrics.totalOutstanding = $scope.creditCards.reduce((sum, card) => sum + card.outstanding, 0);
        
        if ($scope.dashboardMetrics.totalCreditLimit > 0) {
            $scope.dashboardMetrics.utilizationPercentage = ($scope.dashboardMetrics.totalOutstanding / $scope.dashboardMetrics.totalCreditLimit) * 100;
        } else {
            $scope.dashboardMetrics.utilizationPercentage = 0;
        }
    }

    function prepareChartData() {
        // 1. Category-wise Spending
        const categoryMap = $scope.transactions.reduce((acc, tx) => {
            if (tx.status === 'Completed') {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            }
            return acc;
        }, {});
        $scope.categorySpend.labels = Object.keys(categoryMap);
        $scope.categorySpend.data = Object.values(categoryMap);

        // 2. Card-wise Spending
        const cardSpendMap = $scope.transactions.reduce((acc, tx) => {
            if (tx.status === 'Completed') {
                const cardName = $scope.getCardName(tx.cardId);
                acc[cardName] = (acc[cardName] || 0) + tx.amount;
            }
            return acc;
        }, {});
        $scope.cardSpend.labels = Object.keys(cardSpendMap);
        $scope.cardSpend.data = Object.values(cardSpendMap);

        // 3. Monthly Spending Trend (last 12 months)
        const monthlyMap = {};
        for (let i = 11; i >= 0; i--) {
            let d = new Date();
            d.setMonth(d.getMonth() - i);
            let monthKey = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
            monthlyMap[monthKey] = 0;
        }
        $scope.transactions.forEach(tx => {
            if (tx.status === 'Completed') {
                const txDate = new Date(tx.date);
                const monthKey = txDate.getFullYear() + '-' + ('0' + (txDate.getMonth() + 1)).slice(-2);
                if (monthlyMap.hasOwnProperty(monthKey)) {
                    monthlyMap[monthKey] += tx.amount;
                }
            }
        });
        $scope.monthlyTrend.labels = Object.keys(monthlyMap);
        $scope.monthlyTrend.series = ['Spend'];
        $scope.monthlyTrend.data = [Object.values(monthlyMap)];
    }

    function prepareExtraFeatures() {
        // Monthly Spend Forecast
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const dayOfMonth = today.getDate();
        const currentMonthSpend = $scope.dashboardMetrics.totalSpend;
        $scope.forecast = {
            monthly: (currentMonthSpend / dayOfMonth) * daysInMonth
        };

        // Top Spending Categories
        const categoryMap = $scope.transactions.reduce((acc, tx) => {
            if (tx.status === 'Completed') {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            }
            return acc;
        }, {});
        $scope.topCategories = Object.keys(categoryMap).map(key => ({ category: key, amount: categoryMap[key] })).sort((a, b) => b.amount - a.amount);

        // Top Merchants
        const merchantMap = $scope.transactions.reduce((acc, tx) => {
            if (tx.status === 'Completed') {
                acc[tx.merchant] = (acc[tx.merchant] || 0) + tx.amount;
            }
            return acc;
        }, {});
        $scope.topMerchants = Object.keys(merchantMap).map(key => ({ merchant: key, amount: merchantMap[key] })).sort((a, b) => b.amount - a.amount);
    }

    function updateTransactionCategories() {
        const categories = new Set($scope.transactions.map(tx => tx.category));
        $scope.transactionCategories = Array.from(categories).sort();
    }

    // --- UI Interaction & Filters ---
    $scope.sort = function(key) {
        $scope.sortKey = key;
        $scope.reverse = !$scope.reverse;
    };

    $scope.getSortIcon = function(key) {
        if ($scope.sortKey === key) {
            return $scope.reverse ? 'fa-sort-down' : 'fa-sort-up';
        }
        return 'fa-sort';
    };

    $scope.clearFilters = function() {
        $scope.filters = { merchant: '', category: '', cardId: '' };
    };

    $scope.getCardName = function(cardId) {
        const card = $scope.creditCards.find(c => c.id === cardId);
        return card ? card.cardName : 'N/A';
    };

    $scope.getCardNumber = function(cardId) {
        const card = $scope.creditCards.find(c => c.id === cardId);
        return card ? card.cardNumber : 'N/A';
    };

    $scope.getCategoryColor = function(category) {
        const colors = {
            'Food': 'Food',
            'Shopping': 'Shopping',
            'Travel': 'Travel',
            'Entertainment': 'Entertainment',
            'Utilities': 'Utilities',
            'Healthcare': 'Healthcare',
            'Transport': 'Transport',
            'Miscellaneous': 'Miscellaneous'
        };
        return colors[category] || 'secondary';
    };

    // --- Extra Features ---
    $scope.toggleDarkMode = function() {
        // The ng-class on body handles the class toggle.
        // We just need to update chart colors.
        $scope.chartOptions.legend.labels.fontColor = $scope.darkMode ? '#e0e0e0' : '#666';
        // Re-render charts by re-assigning data (a bit of a hack for angular-chart.js)
        $timeout(prepareChartData, 0);
    };

    $scope.exportToCsv = function() {
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Date,Merchant,Category,Card,Amount,Status\r\n';
        
        $scope.transactions.forEach(tx => {
            let row = [
                new Date(tx.date).toLocaleDateString('en-CA'),
                `"${tx.merchant}"`,
                tx.category,
                `"${$scope.getCardName(tx.cardId)}"`,
                tx.amount,
                tx.status
            ].join(',');
            csvContent += row + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    $scope.showTransactionDetails = function(transaction) {
        $scope.selectedTransaction = transaction;
        var modal = new bootstrap.Modal(document.getElementById('transactionDetailModal'));
        modal.show();
    };

    // --- Pagination Logic ---
    function updatePagination() {
        $scope.$watch('filteredTransactions', function(newValue) {
            if (angular.isArray(newValue)) {
                $scope.totalPages = Math.ceil(newValue.length / $scope.itemsPerPage);
                if ($scope.currentPage > $scope.totalPages && $scope.totalPages > 0) {
                    $scope.currentPage = $scope.totalPages;
                }
            }
        });
    }

    $scope.setCurrentPage = function(page) {
        if (page > 0 && page <= $scope.totalPages) {
            $scope.currentPage = page;
        }
    };

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    // --- Initial Load ---
    init();
}]);