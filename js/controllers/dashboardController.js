/*
Senior UI Engineer With PCI-DSS Compliance Expertise
Project: Credit Card Expenditure Dashboard
File: js/controllers/dashboardController.js (Main Controller)
*/

angular.module('creditCardDashboardApp').controller('DashboardController', ['$scope', 'dataService', '$timeout', function($scope, dataService, $timeout) {
    
    // --- 1. INITIALIZATION ---
    function init() {
        $scope.isLoading = true;
        $scope.darkMode = false; // Default to light mode

        // Filter, sort, and view models
        $scope.filters = { merchant: '', category: '', bank: '', card: '', startDate: null, endDate: null };
        $scope.sortKey = 'date';
        $scope.reverseSort = true; // Sort by most recent date by default
        $scope.selectedTransaction = null;
        
        // Data holders
        $scope.cards = [];
        $scope.transactions = [];
        $scope.filteredTransactions = [];
        $scope.categories = [];
        $scope.banks = [];

        // Dashboard metrics
        $scope.summary = {};
        $scope.budget = { monthlyBudget: 50000, currentSpend: 0, remaining: 0, utilization: 0 };

        // Chart instances
        $scope.charts = { category: null, monthly: null, card: null };

        // Fetch initial data from the service
        dataService.getCards().then(function(data) {
            $scope.cards = data;
            $scope.banks = [...new Set(data.map(c => c.bank))];
        });

        dataService.getTransactions().then(function(data) {
            $scope.transactions = data;
            $scope.categories = [...new Set(data.map(t => t.category))];
            // Use $timeout to ensure the digest cycle completes before calculations
            $timeout(function(){
                updateDashboard();
                $scope.isLoading = false;
            });
        });

        // Initialize Bootstrap modal
        $scope.transactionModal = new bootstrap.Modal(document.getElementById('transactionModal'));
    }

    // --- 2. DASHBOARD CALCULATIONS & UPDATES ---
    function updateDashboard() {
        if (!$scope.cards.length || !$scope.transactions.length) return;

        // Apply filters before calculations
        const currentFiltered = $scope.transactions.filter(tx => $scope.filterTransactions(tx));

        calculateSummaryMetrics();
        calculateBudget(currentFiltered);
        
        // Prepare data for charts based on filtered transactions
        const categoryData = prepareCategoryChartData(currentFiltered);
        const monthlyData = prepareMonthlyTrendData(currentFiltered);
        const cardData = prepareCardSpendData(currentFiltered);

        // Render charts with new data
        renderPieChart('categorySpendChart', 'category', 'Category-wise Spending', categoryData.labels, categoryData.data);
        renderBarChart('monthlyTrendChart', 'monthly', 'Monthly Spending Trend', monthlyData.labels, monthlyData.data);
        renderDoughnutChart('cardSpendChart', 'card', 'Card-wise Spending', cardData.labels, cardData.data);
    }

    function calculateSummaryMetrics() {
        $scope.summary.totalCreditLimit = $scope.cards.reduce((sum, card) => sum + card.creditLimit, 0);
        $scope.summary.totalAvailableCredit = $scope.cards.reduce((sum, card) => sum + card.availableCredit, 0);
        $scope.summary.totalOutstanding = $scope.cards.reduce((sum, card) => sum + card.outstanding, 0);
        $scope.summary.utilizationPercentage = ($scope.summary.totalOutstanding / $scope.summary.totalCreditLimit) * 100;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        $scope.summary.totalMonthlySpend = $scope.transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            })
            .reduce((sum, tx) => sum + tx.amount, 0);
    }

    function calculateBudget(filteredTxs) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        $scope.budget.currentSpend = filteredTxs
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            })
            .reduce((sum, tx) => sum + tx.amount, 0);
        
        $scope.budget.remaining = $scope.budget.monthlyBudget - $scope.budget.currentSpend;
        $scope.budget.utilization = ($scope.budget.currentSpend / $scope.budget.monthlyBudget) * 100;
    }

    // --- 3. CHARTING LOGIC (using Chart.js) ---
    const chartColors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf', '#198754'];

    function renderPieChart(elementId, chartKey, title, labels, data) {
        if ($scope.charts[chartKey]) $scope.charts[chartKey].destroy();
        const ctx = document.getElementById(elementId).getContext('2d');
        $scope.charts[chartKey] = new Chart(ctx, {
            type: 'pie',
            data: { labels: labels, datasets: [{ data: data, backgroundColor: chartColors }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    }

    function renderDoughnutChart(elementId, chartKey, title, labels, data) {
        if ($scope.charts[chartKey]) $scope.charts[chartKey].destroy();
        const ctx = document.getElementById(elementId).getContext('2d');
        $scope.charts[chartKey] = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: labels, datasets: [{ data: data, backgroundColor: chartColors }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    }

    function renderBarChart(elementId, chartKey, title, labels, data) {
        if ($scope.charts[chartKey]) $scope.charts[chartKey].destroy();
        const ctx = document.getElementById(elementId).getContext('2d');
        $scope.charts[chartKey] = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Spend', data: data, backgroundColor: 'rgba(54, 162, 235, 0.6)' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    // --- 4. DATA PREPARATION FOR CHARTS ---
    function prepareCategoryChartData(txs) {
        const spend = txs.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});
        return { labels: Object.keys(spend), data: Object.values(spend) };
    }

    function prepareCardSpendData(txs) {
        const spend = txs.reduce((acc, tx) => {
            acc[tx.cardName] = (acc[tx.cardName] || 0) + tx.amount;
            return acc;
        }, {});
        return { labels: Object.keys(spend), data: Object.values(spend) };
    }

    function prepareMonthlyTrendData(txs) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const spend = {};
        const today = new Date();
        // Initialize last 12 months
        for (let i = 11; i >= 0; i--) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            spend[key] = 0;
        }
        txs.forEach(tx => {
            const txDate = new Date(tx.date);
            const key = `${monthNames[txDate.getMonth()]} ${txDate.getFullYear()}`;
            if (key in spend) {
                spend[key] += tx.amount;
            }
        });
        return { labels: Object.keys(spend), data: Object.values(spend) };
    }

    // --- 5. FILTERS & EVENT HANDLERS ---
    $scope.filterTransactions = function(transaction) {
        const { merchant, category, bank, card, startDate, endDate } = $scope.filters;
        const txDate = new Date(transaction.date);

        return (!merchant || transaction.merchant.toLowerCase().includes(merchant.toLowerCase())) &&
               (!category || transaction.category === category) &&
               (!bank || transaction.bank === bank) &&
               (!card || transaction.cardName === card.cardName) &&
               (!startDate || txDate >= startDate) &&
               (!endDate || txDate <= endDate);
    };

    // Watch for filter changes to update charts dynamically
    $scope.$watch('filters', updateDashboard, true);

    $scope.sortBy = function(key) {
        if ($scope.sortKey === key) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortKey = key;
            $scope.reverseSort = false;
        }
    };

    $scope.getSortIcon = (key) => {
        if ($scope.sortKey !== key) return 'fa-sort';
        return $scope.reverseSort ? 'fa-sort-down' : 'fa-sort-up';
    };

    $scope.showTransactionDetails = function(tx) {
        $scope.selectedTransaction = tx;
        $scope.transactionModal.show();
    };

    $scope.toggleDarkMode = function() {
        // This function is triggered by ng-change, model is already updated.
        // We just need to re-render charts for the new theme.
        updateDashboard();
    };

    $scope.getCategoryClass = (category) => 'bg-' + category.split(' ')[0].toLowerCase();

    // --- 6. EXTRA FEATURES ---
    $scope.exportToCSV = function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = ["Date", "Merchant", "Category", "Card", "Bank", "Amount", "Status"];
        csvContent += headers.join(",") + "\r\n";

        $scope.filteredTransactions.forEach(tx => {
            const row = [
                new Date(tx.date).toLocaleDateString(),
                `"${tx.merchant}"`,
                tx.category,
                tx.cardName,
                tx.bank,
                tx.amount,
                tx.status
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
    };

    // --- KICK-OFF --- 
    init();
}]);