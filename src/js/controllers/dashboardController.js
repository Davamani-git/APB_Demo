/**
 * dashboardController.js
 *
 * This controller is responsible for the main dashboard logic. It fetches data
 * from the dataService, performs calculations for summary metrics, prepares
 * data for charts, and handles user interactions like filtering, sorting,
 * and viewing transaction details.
 */
app.controller('dashboardController', ['$scope', '$timeout', 'dataService', 'ChartJs', function($scope, $timeout, dataService, ChartJs) {

    // --- Initialization ---
    function init() {
        $scope.loading = true;
        $scope.darkMode = false; // Default to light mode

        // Simulate a network request delay
        $timeout(function() {
            // Fetch data from the service
            $scope.creditCards = dataService.getCreditCards();
            $scope.transactions = dataService.getTransactions();

            // Initialize filters and sorting
            $scope.filters = { searchText: '', category: '', cardId: '' };
            $scope.sortKey = 'date';
            $scope.reverse = true;

            // Process data
            $scope.transactionCategories = getUniqueCategories($scope.transactions);
            calculateSummaryMetrics();
            prepareChartData();
            calculateAnalytics();

            // Initialize Bootstrap components that need it
            var transactionModalEl = document.getElementById('transactionDetailModal');
            $scope.transactionModal = new bootstrap.Modal(transactionModalEl);

            $scope.loading = false;
        }, 1500); // 1.5 second delay
    }

    // --- Summary Metrics Calculation ---
    function calculateSummaryMetrics() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate total spend for the current month
        const totalSpendCurrentMonth = $scope.transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            })
            .reduce((sum, tx) => sum + tx.amount, 0);

        // Calculate totals from all cards
        const totalCreditLimit = $scope.creditCards.reduce((sum, card) => sum + card.creditLimit, 0);
        const totalAvailableCredit = $scope.creditCards.reduce((sum, card) => sum + card.availableCredit, 0);
        const totalOutstanding = $scope.creditCards.reduce((sum, card) => sum + card.outstanding, 0);
        const utilizationPercentage = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;

        $scope.summary = {
            totalSpend: totalSpendCurrentMonth,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            utilizationPercentage: utilizationPercentage,
            transactionCount: $scope.transactions.length
        };
    }

    // --- Chart Data Preparation ---
    function prepareChartData() {
        // 1. Category-wise Spending (Doughnut Chart)
        const categorySpend = $scope.transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});

        $scope.categoryChart = {
            labels: Object.keys(categorySpend),
            data: Object.values(categorySpend),
            options: {
                legend: { display: true, position: 'right' },
                title: { display: false }
            },
            // Using Chart.js 2.9.4 color format
            colors: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69', '#fd7e14']
        };

        // 2. Monthly Spending Trend (Line Chart)
        const monthlySpend = {};
        const monthLabels = [];
        const today = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear().toString().slice(-2);
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

        $scope.monthlyTrendChart = {
            labels: monthLabels,
            series: ['Spend'],
            data: [Object.values(monthlySpend)],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) { return '€' + value; }
                        }
                    }]
                },
                legend: { display: false }
            }
        };
    }

    // --- Advanced Analytics Calculation ---
    function calculateAnalytics() {
        // 1. Top Spending Categories
        const categorySpend = $scope.transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});
        $scope.topCategories = Object.keys(categorySpend)
            .map(name => ({ name: name, amount: categorySpend[name] }))
            .sort((a, b) => b.amount - a.amount);

        // 2. Top Merchants
        const merchantSpend = $scope.transactions.reduce((acc, tx) => {
            acc[tx.merchant] = (acc[tx.merchant] || 0) + tx.amount;
            return acc;
        }, {});
        $scope.topMerchants = Object.keys(merchantSpend)
            .map(name => ({ name: name, amount: merchantSpend[name] }))
            .sort((a, b) => b.amount - a.amount);

        // 3. Monthly Spend Forecast
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const currentDay = now.getDate();
        const monthlySpend = $scope.summary.totalSpend;
        const forecastedSpend = (monthlySpend / currentDay) * daysInMonth;
        $scope.forecast = {
            monthly: forecastedSpend
        };
    }

    // --- UI Interaction Handlers ---

    // Toggle dark mode
    $scope.toggleDarkMode = function() {
        // The ng-model and ng-change handle the state.
        // This function is here for any additional logic if needed.
    };

    // Sort table data
    $scope.sort = function(key) {
        $scope.sortKey = key;
        $scope.reverse = !$scope.reverse;
    };

    // Clear all filters
    $scope.clearFilters = function() {
        $scope.filters = { searchText: '', category: '', cardId: '' };
    };

    // Show transaction details in a modal
    $scope.showTransactionDetails = function(transaction) {
        $scope.selectedTransaction = transaction;
        $scope.transactionModal.show();
    };

    // Export transaction data to a CSV file
    $scope.exportToCsv = function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = ["ID", "Date", "Merchant", "Amount", "Category", "CardName", "Status", "Remarks"];
        csvContent += headers.join(",") + "\r\n";

        $scope.transactions.forEach(function(tx) {
            const cardName = $scope.getCardById(tx.cardId).cardName;
            const row = [tx.id, tx.date, `"${tx.merchant}"`, tx.amount, tx.category, cardName, tx.status, `"${tx.remarks || ''}"`];
            csvContent += row.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Utility Functions ---

    // Get unique categories for the filter dropdown
    function getUniqueCategories(transactions) {
        const categories = new Set();
        transactions.forEach(tx => categories.add(tx.category));
        return Array.from(categories).sort();
    }

    // Find a credit card by its ID
    $scope.getCardById = function(cardId) {
        return $scope.creditCards.find(card => card.id === cardId) || {};
    };

    // Get a CSS class for category badges
    $scope.getCategoryClass = function(category) {
        const sanitized = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        return `bg-category-${sanitized}`;
    };

    // --- Run Initialization ---
    init();
}]);
