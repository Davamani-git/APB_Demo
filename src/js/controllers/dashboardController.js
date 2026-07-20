/**
 * Dashboard Controller
 * Manages the main view of the dashboard, handles user interactions, and prepares data for display.
 */
angular.module('creditCardDashboardApp').controller('dashboardController', ['$scope', 'dataService', '$timeout', '$filter', function($scope, dataService, $timeout, $filter) {

    // --- Initialization ---
    function init() {
        // Scope model initialization
        $scope.isLoading = true;
        $scope.isDarkMode = false;
        $scope.cards = [];
        $scope.transactions = [];
        $scope.searchFilter = { description: '', category: '', cardId: '' };
        $scope.sortType = 'date';
        $scope.sortReverse = true;
        $scope.selectedTransaction = null;

        // Chart data initialization
        $scope.monthlySpend = { data: [], labels: [], series: ['Spend'] };
        $scope.categorySpend = { data: [], labels: [] };
        $scope.merchantSpend = { data: [], labels: [], series: ['Spend'] };
        $scope.forecast = { data: [], labels: [], series: ['Actual', 'Forecast'] };
        $scope.chartOptions = { scales: { yAxes: [{ ticks: { beginAtZero: true } }], xAxes: [{ ticks: { beginAtZero: true } }] } };

        // Fetch data from the service
        const cardPromise = dataService.getCards();
        const transactionPromise = dataService.getTransactions();

        // Use $q.all to wait for all data to be loaded
        Promise.all([cardPromise, transactionPromise]).then(function(results) {
            $scope.cards = results[0];
            $scope.transactions = results[1];

            // Process data once loaded
            calculateDashboardMetrics();
            prepareChartsData();
            
            $scope.isLoading = false;
            $scope.$apply(); // Apply changes as this is outside angular digest cycle
        });
    }

    // --- Metric Calculations ---
    function calculateDashboardMetrics() {
        $scope.totalOutstanding = $scope.cards.reduce((sum, card) => sum + card.outstanding, 0);
        $scope.totalAvailableCredit = $scope.cards.reduce((sum, card) => sum + card.availableCredit, 0);
        $scope.totalCreditLimit = $scope.cards.reduce((sum, card) => sum + card.creditLimit, 0);
        $scope.uniqueCategories = [...new Set($scope.transactions.map(tx => tx.category))].sort();
    }

    // --- Chart Data Preparation ---
    function prepareChartsData() {
        // 1. Monthly Spend Chart
        const monthlyData = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
            const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthlyData[monthKey] = { total: 0, label: monthLabel };
        }
        $scope.transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const monthKey = `${txDate.getFullYear()}-${txDate.getMonth()}`;
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].total += tx.amount;
            }
        });
        $scope.monthlySpend.labels = Object.values(monthlyData).map(m => m.label);
        $scope.monthlySpend.data = [Object.values(monthlyData).map(m => m.total)];

        // 2. Category Spend Chart
        const categoryData = $scope.transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});
        const sortedCategories = Object.entries(categoryData).sort((a, b) => b[1] - a[1]);
        $scope.categorySpend.labels = sortedCategories.map(c => c[0]);
        $scope.categorySpend.data = sortedCategories.map(c => c[1]);

        // 3. Top Merchants Chart
        const merchantData = $scope.transactions.reduce((acc, tx) => {
            acc[tx.merchant] = (acc[tx.merchant] || 0) + tx.amount;
            return acc;
        }, {});
        const topMerchants = Object.entries(merchantData).sort((a, b) => b[1] - a[1]).slice(0, 5).reverse(); // reverse for horizontal bar
        $scope.merchantSpend.labels = topMerchants.map(m => m[0]);
        $scope.merchantSpend.data = [topMerchants.map(m => m[1])];

        // 4. Monthly Spend Forecast
        calculateForecast();
    }

    // --- Feature Functions ---
    $scope.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode', $scope.isDarkMode);
    };

    $scope.sort = function(sortType) {
        $scope.sortType = sortType;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.showTransactionDetails = function(transaction) {
        $scope.selectedTransaction = transaction;
        const modal = new bootstrap.Modal(document.getElementById('transactionDetailModal'));
        modal.show();
    };

    $scope.getCardById = function(cardId) {
        return $scope.cards.find(card => card.id === cardId);
    };

    $scope.getCategoryClass = function(category) {
        const catClass = 'bg-category-' + category.toLowerCase();
        // A simple mapping to avoid issues with class names
        const validClasses = ['food', 'shopping', 'transport', 'entertainment', 'travel', 'health', 'groceries'];
        if (validClasses.includes(category.toLowerCase())) {
            return catClass;
        }
        return 'bg-category-default';
    };

    $scope.exportToCSV = function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Merchant,Category,Amount,Card\n";
        const filteredTxs = $filter('filter')($scope.transactions, $scope.searchFilter);

        filteredTxs.forEach(tx => {
            const cardName = $scope.getCardById(tx.cardId).cardName;
            const row = [
                $filter('date')(tx.date, 'yyyy-MM-dd'),
                `"${tx.merchant}"`,
                tx.category,
                tx.amount,
                `"${cardName}"`
            ].join(',');
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

    function calculateForecast() {
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        const currentMonthTxs = $scope.transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
        });

        $scope.currentMonthSpend = currentMonthTxs.reduce((sum, tx) => sum + tx.amount, 0);
        const dailyAvg = $scope.currentMonthSpend / currentDay;
        $scope.monthlyForecast = dailyAvg * daysInMonth;

        // Prepare chart data
        $scope.forecast.labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const actualData = Array(daysInMonth).fill(null);
        const forecastData = Array(daysInMonth).fill(null);

        let cumulativeSpend = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const spendOnDay = currentMonthTxs
                .filter(tx => new Date(tx.date).getDate() === day)
                .reduce((sum, tx) => sum + tx.amount, 0);
            cumulativeSpend += spendOnDay;

            if (day <= currentDay) {
                actualData[day - 1] = cumulativeSpend;
            }
            if (day >= currentDay -1) { // Start forecast line from current day's actual spend
                 forecastData[day - 1] = actualData[currentDay-1] + (dailyAvg * (day - (currentDay-1)));
            }
        }
        $scope.forecast.data = [actualData, forecastData];
    }

    // --- Run Initialization ---
    init();
}]);
