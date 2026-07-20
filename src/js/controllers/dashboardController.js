/**
 * Dashboard Controller
 * Handles all the logic for the main dashboard view.
 */
app.controller('dashboardController', ['$scope', '$filter', 'dataService', function ($scope, $filter, dataService) {
    
    // --- INITIALIZATION ---
    $scope.loading = true;
    $scope.darkMode = false;
    $scope.cards = [];
    $scope.transactions = [];
    $scope.currentMonth = new Date().getMonth();

    // Filter and sort models
    $scope.filters = {
        search: '',
        category: ''
    };
    $scope.sort = {
        column: 'date',
        reverse: true
    };

    // Budget settings
    $scope.monthlyBudget = 200000; // Example budget

    // Chart.js options
    $scope.chartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function(value) { return '₹' + value / 1000 + 'k'; }
                }
            }]
        }
    };

    // --- DATA LOADING & PROCESSING ---
    function initializeDashboard() {
        $scope.cards = dataService.getCards();
        $scope.transactions = dataService.getTransactions();

        calculateDashboardMetrics();
        prepareChartData();
        
        $scope.loading = false;
    }

    // --- METRIC CALCULATIONS ---
    function calculateDashboardMetrics() {
        // Total credit metrics
        $scope.totalCreditLimit = $scope.cards.reduce((sum, card) => sum + card.creditLimit, 0);
        $scope.totalAvailableCredit = $scope.cards.reduce((sum, card) => sum + card.availableCredit, 0);
        $scope.totalOutstanding = $scope.cards.reduce((sum, card) => sum + card.outstanding, 0);
        $scope.utilizationPercentage = ($scope.totalOutstanding / $scope.totalCreditLimit) * 100;

        // Transaction-based metrics
        const now = new Date();
        const currentMonthTxs = $scope.transactions.filter(tx => new Date(tx.date).getMonth() === now.getMonth() && new Date(tx.date).getFullYear() === now.getFullYear());
        $scope.totalMonthlySpend = currentMonthTxs.reduce((sum, tx) => sum + tx.amount, 0);
        $scope.numberOfTransactions = $scope.transactions.length;

        // Budget utilization
        $scope.budgetUtilization = ($scope.totalMonthlySpend / $scope.monthlyBudget) * 100;

        // Monthly spend forecast
        calculateForecast();

        // Top spending categories and merchants
        $scope.topCategories = getTopItems('category', 5);
        $scope.topMerchants = getTopItems('merchant', 5);

        // Unique categories for filter dropdown
        $scope.transactionCategories = [...new Set($scope.transactions.map(tx => tx.category))].sort();
    }

    // --- CHART DATA PREPARATION ---
    function prepareChartData() {
        // 1. Category-wise Spending (Doughnut Chart)
        const categorySpend = getTopItems('category', 1000); // Get all
        $scope.categoryChart = {
            labels: Object.keys(categorySpend),
            data: Object.values(categorySpend)
        };

        // 2. Monthly Spending Trend (Bar Chart)
        const monthlySpend = {};
        const monthLabels = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().slice(-2);
            monthLabels.push(monthKey);
            monthlySpend[monthKey] = 0;
        }

        $scope.transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const monthKey = txDate.toLocaleString('default', { month: 'short' }) + ' ' + txDate.getFullYear().toString().slice(-2);
            if (monthlySpend.hasOwnProperty(monthKey)) {
                monthlySpend[monthKey] += tx.amount;
            }
        });

        $scope.monthlySpendChart = {
            labels: monthLabels,
            series: ['Monthly Spend'],
            data: [Object.values(monthlySpend)]
        };
    }

    // --- HELPER & UTILITY FUNCTIONS ---

    // Get top spending items (category or merchant)
    function getTopItems(field, count) {
        const spendMap = $scope.transactions.reduce((acc, tx) => {
            acc[tx[field]] = (acc[tx[field]] || 0) + tx.amount;
            return acc;
        }, {});

        return Object.fromEntries(
            Object.entries(spendMap).sort(([, a], [, b]) => b - a).slice(0, count)
        );
    }

    // Calculate spend forecast
    function calculateForecast() {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const dayOfMonth = today.getDate();
        if ($scope.totalMonthlySpend > 0 && dayOfMonth > 0) {
            $scope.spendForecast = ($scope.totalMonthlySpend / dayOfMonth) * daysInMonth;
        } else {
            $scope.spendForecast = 0;
        }
    }

    // Get card details by ID
    $scope.getCardById = function(cardId) {
        return $scope.cards.find(card => card.id === cardId) || {};
    };

    // --- UI INTERACTION HANDLERS ---

    // Toggle dark mode
    $scope.toggleDarkMode = function () {
        $scope.darkMode = !$scope.darkMode;
    };

    // Sort table columns
    $scope.sortBy = function (column) {
        if ($scope.sort.column === column) {
            $scope.sort.reverse = !$scope.sort.reverse;
        } else {
            $scope.sort.column = column;
            $scope.sort.reverse = false;
        }
    };

    // Get sort icon for table headers
    $scope.getSortIcon = function (column) {
        if ($scope.sort.column === column) {
            return $scope.sort.reverse ? 'fa-sort-down' : 'fa-sort-up';
        }
        return 'fa-sort';
    };

    // Show transaction details in modal
    $scope.showTransactionDetails = function (transaction) {
        $scope.selectedTransaction = transaction;
    };

    // Export transactions to CSV
    $scope.exportToCSV = function () {
        const headers = ['Transaction ID', 'Date', 'Merchant', 'Category', 'Card Name', 'Amount', 'Status'];
        const filteredTxs = $filter('orderBy')($filter('filter')($scope.transactions, $scope.filters.search), $scope.sort.column, $scope.sort.reverse);

        let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
        
        filteredTxs.forEach(tx => {
            const cardName = $scope.getCardById(tx.cardId).cardName;
            const row = [tx.id, $filter('date')(tx.date, 'yyyy-MM-dd'), tx.merchant, tx.category, cardName, tx.amount, tx.status].join(',');
            csvContent += row + '\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- RUN INITIALIZATION ---
    initializeDashboard();
}]);
