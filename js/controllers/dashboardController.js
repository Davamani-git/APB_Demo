angular.module('creditCardDashboardApp').controller('dashboardController', ['$scope', 'dataService', function($scope, dataService) {

    // Initialize scope variables
    $scope.creditCards = dataService.getCreditCards();
    $scope.transactions = dataService.getTransactions();
    $scope.darkMode = false;
    $scope.summaryMetrics = [];
    $scope.budget = {};
    $scope.recentTransactions = [];
    $scope.search = {};
    $scope.filter = {};
    $scope.sortKey = 'date';
    $scope.reverse = true;

    // Initialize the controller
    function init() {
        calculateDashboardSummary();
        initCharts();
        setupFilters();
        $scope.recentTransactions = $scope.transactions.slice(0, 5);
    }

    // Calculate dashboard summary metrics
    function calculateDashboardSummary() {
        let totalMonthlySpend = 0;
        let totalCreditLimit = 0;
        let outstandingAmount = 0;

        $scope.creditCards.forEach(card => {
            totalCreditLimit += card.creditLimit;
            outstandingAmount += card.outstanding;
        });

        $scope.transactions.forEach(tx => {
            totalMonthlySpend += tx.amount;
        });

        const availableCredit = totalCreditLimit - outstandingAmount;
        const utilizationPercentage = (outstandingAmount / totalCreditLimit) * 100;

        $scope.summaryMetrics = [
            { label: 'Total Monthly Spend', value: totalMonthlySpend.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) },
            { label: 'Total Credit Limit', value: totalCreditLimit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) },
            { label: 'Available Credit', value: availableCredit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) },
            { label: 'Outstanding Amount', value: outstandingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) },
            { label: 'Utilization', value: utilizationPercentage.toFixed(2) + '%' },
            { label: 'Transactions', value: $scope.transactions.length }
        ];

        // Budget Tracking
        $scope.budget = {
            monthly: 25000,
            currentSpend: totalMonthlySpend,
            remaining: 25000 - totalMonthlySpend,
            utilization: (totalMonthlySpend / 25000) * 100
        };
    }

    // Initialize charts
    function initCharts() {
        // Category-wise Spending
        const categoryData = $scope.transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});
        new Chart(document.getElementById('categoryChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }]
            }
        });

        // Monthly Spending Trend
        const monthlyData = $scope.transactions.reduce((acc, tx) => {
            const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + tx.amount;
            return acc;
        }, {});
        new Chart(document.getElementById('monthlyTrendChart'), {
            type: 'line',
            data: {
                labels: Object.keys(monthlyData),
                datasets: [{
                    label: 'Monthly Spend',
                    data: Object.values(monthlyData),
                    fill: false,
                    borderColor: '#36A2EB',
                    tension: 0.1
                }]
            }
        });

        // Card-wise Spending Distribution
        const cardData = $scope.transactions.reduce((acc, tx) => {
            acc[tx.cardUsed] = (acc[tx.cardUsed] || 0) + tx.amount;
            return acc;
        }, {});
        new Chart(document.getElementById('cardDistributionChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(cardData),
                datasets: [{
                    data: Object.values(cardData),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            }
        });
    }

    // Setup filter options
    function setupFilters() {
        $scope.categories = [...new Set($scope.transactions.map(tx => tx.category))];
        $scope.banks = [...new Set($scope.creditCards.map(card => card.bank))];
    }

    // Custom filter functions
    $scope.filterByCategory = (transaction) => {
        return !$scope.filter.category || transaction.category === $scope.filter.category;
    };
    $scope.filterByBank = (transaction) => {
        if (!$scope.filter.bank) return true;
        const card = $scope.creditCards.find(c => c.cardName === transaction.cardUsed);
        return card && card.bank === $scope.filter.bank;
    };
    $scope.filterByCard = (transaction) => {
        return !$scope.filter.card || transaction.cardUsed === $scope.filter.card.cardName;
    };

    // Sort table data
    $scope.sort = (key) => {
        $scope.sortKey = key;
        $scope.reverse = !$scope.reverse;
    };

    // Export to CSV
    $scope.exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Merchant,Category,Card Used,Amount,Status,Remarks\n";
        $scope.filteredTransactions.forEach(tx => {
            csvContent += `${tx.date},${tx.merchant},${tx.category},${tx.cardUsed},${tx.amount},${tx.paymentStatus},"${tx.remarks}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
    };

    // Toggle dark mode
    $scope.toggleDarkMode = () => {
        document.body.classList.toggle('darkMode', $scope.darkMode);
    };

    // Show transaction details modal
    $scope.showTransactionDetails = (transaction) => {
        $scope.selectedTransaction = transaction;
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        modal.show();
    };

    // Run initialization
    init();
}]);
