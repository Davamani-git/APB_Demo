/**
 * Dashboard Controller (DashboardController)
 * Manages the main dashboard view, handles user interactions, and processes data for display.
 * Follows the 'controller as vm' syntax for better code structure and readability.
 */
angular.module('creditCardDashboardApp').controller('DashboardController', ['dataService', '$filter', '$q', function (dataService, $filter, $q) {
    var vm = this; // vm stands for ViewModel

    // --- INITIALIZATION ---
    vm.isLoading = true;
    vm.isDarkMode = false;
    vm.cards = [];
    vm.transactions = [];
    vm.summary = {};
    vm.analytics = {};
    vm.charts = { category: {}, monthly: {} };
    vm.filters = { merchant: '', category: '', cardId: '', startDate: null, endDate: null };
    vm.sort = { column: 'date', reverse: true };

    // Chart.js options
    vm.chartOptions = {
        plugins: {
            legend: { labels: { color: vm.isDarkMode ? '#fff' : '#666' } }
        }
    };

    /**
     * Initializes the controller by fetching all necessary data.
     */
    function activate() {
        vm.isLoading = true;
        // Use $q.all to wait for all data promises to resolve
        $q.all([
            dataService.getCards(),
            dataService.getTransactions()
        ]).then(function (results) {
            vm.cards = results[0];
            vm.transactions = results[1].map(tx => ({ ...tx, date: new Date(tx.date) })); // Convert date strings to Date objects

            // Once data is loaded, process it
            processDashboardData();

            vm.isLoading = false;
        });
    }

    activate(); // Run initialization

    // --- DATA PROCESSING ---

    /**
     * Processes raw data to calculate summaries, analytics, and chart data.
     */
    function processDashboardData() {
        calculateSummaryMetrics();
        prepareChartData();
        calculateAdvancedAnalytics();
        vm.uniqueCategories = [...new Set(vm.transactions.map(item => item.category))].sort();
    }

    /**
     * Calculates the top-level summary metrics for the dashboard header.
     */
    function calculateSummaryMetrics() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTransactions = vm.transactions.filter(tx => 
            tx.date.getMonth() === currentMonth && tx.date.getFullYear() === currentYear
        );

        vm.summary.totalSpend = monthlyTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        vm.summary.totalLimit = vm.cards.reduce((sum, card) => sum + card.creditLimit, 0);
        vm.summary.totalAvailable = vm.cards.reduce((sum, card) => sum + card.availableCredit, 0);
        vm.summary.totalOutstanding = vm.cards.reduce((sum, card) => sum + card.outstanding, 0);
        vm.summary.avgUtilization = vm.summary.totalLimit > 0 ? (vm.summary.totalOutstanding / vm.summary.totalLimit) * 100 : 0;
        vm.summary.transactionCount = monthlyTransactions.length;
    }

    /**
     * Prepares data structures required by Chart.js for visualization.
     */
    function prepareChartData() {
        // 1. Category-wise Spending (Doughnut Chart)
        const categorySpend = vm.transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});
        vm.charts.category.labels = Object.keys(categorySpend);
        vm.charts.category.data = Object.values(categorySpend);
        vm.charts.category.colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

        // 2. Monthly Spending Trend (Line Chart)
        const monthlySpend = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            let key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthlySpend[key] = 0;
        }
        vm.transactions.forEach(tx => {
            let key = `${monthNames[tx.date.getMonth()]} ${tx.date.getFullYear()}`;
            if (monthlySpend.hasOwnProperty(key)) {
                monthlySpend[key] += tx.amount;
            }
        });
        vm.charts.monthly.labels = Object.keys(monthlySpend);
        vm.charts.monthly.data = [Object.values(monthlySpend)];
        vm.charts.monthly.series = ['Spend'];
    }

    /**
     * Calculates extra analytics like top spenders and forecasts.
     */
    function calculateAdvancedAnalytics() {
        // Top 5 Spending Categories
        const categoryTotals = $filter('orderBy')(Object.entries(vm.charts.category.data.reduce((acc, val, idx) => {
            acc[vm.charts.category.labels[idx]] = val;
            return acc;
        }, {})).map(([name, amount]) => ({ name, amount })), '-amount').slice(0, 5);

        // Top 5 Merchants
        const merchantTotals = vm.transactions.reduce((acc, tx) => {
            acc[tx.merchant] = (acc[tx.merchant] || 0) + tx.amount;
            return acc;
        }, {});
        const topMerchants = $filter('orderBy')(Object.entries(merchantTotals).map(([name, amount]) => ({ name, amount })), '-amount').slice(0, 5);

        // Monthly Spend Forecast
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const dayOfMonth = today.getDate();
        const currentMonthSpend = vm.summary.totalSpend;
        const projectedSpend = (currentMonthSpend / dayOfMonth) * daysInMonth;

        vm.analytics = {
            topCategories: categoryTotals,
            topMerchants: topMerchants,
            forecast: {
                amount: projectedSpend,
                percentage: (currentMonthSpend / projectedSpend) * 100
            }
        };
    }

    // --- VIEW-MODEL FUNCTIONS ---

    /**
     * Toggles dark mode and updates chart colors.
     */
    vm.toggleDarkMode = function () {
        // This function is bound to ng-change, vm.isDarkMode is already updated.
        vm.chartOptions.plugins.legend.labels.color = vm.isDarkMode ? '#fff' : '#666';
    };

    /**
     * Exports the currently filtered transactions to a CSV file.
     */
    vm.exportToCsv = function () {
        const data = vm.filteredTransactions; // Use the already filtered data from the view
        if (!data || data.length === 0) {
            alert('No data to export.');
            return;
        }
        const headers = ['Transaction ID', 'Date', 'Merchant', 'Category', 'Amount', 'Card', 'Status'];
        const csvRows = [headers.join(',')];

        data.forEach(row => {
            const cardName = vm.getCardById(row.cardId).cardName.replace(/,/g, ''); // remove commas
            const values = [
                row.id,
                $filter('date')(row.date, 'yyyy-MM-dd'),
                `"${row.merchant}"`,
                row.category,
                row.amount,
                cardName,
                row.status
            ];
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'transactions.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    /**
     * Sets the selected transaction to be displayed in the modal.
     * @param {object} transaction - The transaction object to display.
     */
    vm.showTransactionDetails = function (transaction) {
        vm.selectedTransaction = transaction;
    };

    /**
     * Retrieves a card object by its ID.
     * @param {number} cardId - The ID of the card.
     * @returns {object} The card object or an empty object if not found.
     */
    vm.getCardById = function (cardId) {
        return vm.cards.find(c => c.id === cardId) || {};
    };

    /**
     * Custom filter function for date range.
     * @param {object} transaction - The transaction to check.
     * @returns {boolean} - True if the transaction is within the selected date range.
     */
    vm.filterByDateRange = function (transaction) {
        const startDate = vm.filters.startDate;
        const endDate = vm.filters.endDate;
        if (!startDate && !endDate) return true;

        const txDate = transaction.date;
        const startMatch = !startDate || txDate >= startDate;
        // For end date, we should check up to the end of that day
        const endMatch = !endDate || txDate < new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

        return startMatch && endMatch;
    };

    /**
     * Resets all filter inputs to their default state.
     */
    vm.clearFilters = function () {
        vm.filters = { merchant: '', category: '', cardId: '', startDate: null, endDate: null };
    };

    /**
     * Sets the sorting column and direction.
     * @param {string} column - The column name to sort by.
     */
    vm.sortBy = function (column) {
        if (vm.sort.column === column) {
            vm.sort.reverse = !vm.sort.reverse;
        } else {
            vm.sort.column = column;
            vm.sort.reverse = false;
        }
    };

    /**
     * Gets the appropriate Font Awesome icon class for the sort indicator.
     * @param {string} column - The column name to check.
     * @returns {string} - The CSS class for the sort icon.
     */
    vm.getSortIcon = function (column) {
        if (vm.sort.column === column) {
            return vm.sort.reverse ? 'fa-sort-down' : 'fa-sort-up';
        }
        return 'fa-sort';
    };
}]);
