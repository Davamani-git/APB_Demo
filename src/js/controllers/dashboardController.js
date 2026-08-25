/**
 * Dashboard Controller
 * @controller DashboardController
 * 
 * This controller manages the main dashboard view. It acts as the ViewModel (VM) in an MVVM pattern.
 * It fetches data from the dataService, prepares it for the view, and handles all user interactions
 * like filtering, sorting, and toggling UI modes.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .controller('DashboardController', DashboardController);

    // Dependency Injection: $scope for view binding, $timeout for simulating load, dataService for data access
    DashboardController.$inject = ['$scope', '$timeout', 'dataService'];

    function DashboardController($scope, $timeout, dataService) {
        var vm = this; // Using 'controller as' syntax (vm for ViewModel)

        // --- ViewModel Properties ---
        vm.loading = true;
        vm.isDarkMode = false;

        // Banking menu: which top-level section is active ('accounts' or 'cards')
        vm.activeSection = 'accounts';

        vm.cards = [];
        vm.transactions = [];
        vm.filteredTransactions = [];
        vm.summary = {};
        vm.filters = {
            merchant: '',
            category: '',
            cardId: '',
            startDate: null,
            endDate: null
        };
        vm.filterOptions = {};
        vm.sortColumn = 'date';
        vm.sortReverse = true;
        vm.selectedTransaction = null;

        // Chart data models
        vm.categoryChart = {};
        vm.monthlyTrendChart = {};

        // Accounts section state
        vm.accounts = [];
        vm.accountTransactions = [];
        vm.filteredAccountTransactions = [];
        vm.accountsSummary = {};
        vm.accountFilters = {
            description: '',
            category: '',
            accountId: '',
            startDate: null,
            endDate: null
        };
        vm.accountFilterOptions = {};
        vm.accountSortColumn = 'date';
        vm.accountSortReverse = true;
        vm.selectedAccountTransaction = null;

        // --- ViewModel Functions ---
        vm.init = init;
        vm.setActiveSection = setActiveSection;
        vm.applyFilters = applyFilters;
        vm.getCardById = getCardById;
        vm.sortData = sortData;
        vm.getSortIcon = getSortIcon;
        vm.exportToCSV = exportToCSV;
        vm.toggleDarkMode = toggleDarkMode;
        vm.showTransactionDetails = showTransactionDetails;

        vm.applyAccountFilters = applyAccountFilters;
        vm.getAccountById = getAccountById;
        vm.sortAccountData = sortAccountData;
        vm.getAccountSortIcon = getAccountSortIcon;
        vm.exportAccountsToCSV = exportAccountsToCSV;
        vm.showAccountTransactionDetails = showAccountTransactionDetails;

        // --- Initialization ---
        vm.init();

        // --- Function Implementations ---

        /**
         * Initializes the controller, fetches all necessary data, and sets up the dashboard.
         */
        function init() {
            vm.loading = true;
            // Simulate a network request delay for a better UX demonstration
            $timeout(function() {
                vm.cards = dataService.getCards();
                vm.transactions = dataService.getTransactions();
                vm.filterOptions.categories = dataService.getUniqueCategories();

                // Set initial date filters to the last 30 days
                var today = new Date();
                var lastMonth = new Date();
                lastMonth.setDate(today.getDate() - 30);
                vm.filters.startDate = lastMonth;
                vm.filters.endDate = today;

                vm.applyFilters(); // Apply initial filters and calculate all metrics

                vm.accounts = dataService.getAccounts();
                vm.accountTransactions = dataService.getAccountTransactions();
                vm.accountFilterOptions.categories = dataService.getUniqueAccountCategories();

                vm.accountFilters.startDate = lastMonth;
                vm.accountFilters.endDate = today;

                vm.applyAccountFilters(); // Apply initial filters and calculate account metrics

                vm.loading = false;
            }, 1000); // 1-second loading simulation
        }

        /**
         * Switches the active top-level banking section (e.g. 'accounts' or 'cards').
         * @param {string} section - The section identifier to activate.
         */
        function setActiveSection(section) {
            vm.activeSection = section;
        }

        /**
         * Applies all active filters to the transaction list and recalculates all dashboard metrics and charts.
         */
        function applyFilters() {
            vm.filteredTransactions = dataService.getFilteredTransactions(vm.filters);
            calculateDashboardMetrics();
            prepareChartData();
        }

        /**
         * Calculates all summary metrics based on the currently filtered transactions.
         */
        function calculateDashboardMetrics() {
            vm.summary = dataService.getDashboardSummary(vm.cards, vm.filteredTransactions);
            vm.monthlyForecast = dataService.getMonthlySpendForecast(vm.transactions);
            vm.topCategories = dataService.getTopSpendingGroups(vm.filteredTransactions, 'category', 5);
            vm.topMerchants = dataService.getTopSpendingGroups(vm.filteredTransactions, 'merchant', 5);
        }

        /**
         * Prepares data for all charts based on filtered transactions.
         */
        function prepareChartData() {
            // Category-wise Spending (Doughnut Chart)
            var categoryData = dataService.getCategorySpending(vm.filteredTransactions);
            vm.categoryChart.labels = categoryData.labels;
            vm.categoryChart.data = categoryData.data;
            vm.categoryChart.options = { legend: { display: true, position: 'right' } };
            vm.categoryChart.colors = ['#EC0000', '#1A1A1A', '#EE9CA7', '#666666', '#FF6B5B', '#B3B3B3', '#8B0000'];

            // Monthly Spending Trend (Line Chart)
            var monthlyData = dataService.getMonthlySpendingTrend(vm.transactions);
            vm.monthlyTrendChart.labels = monthlyData.labels;
            vm.monthlyTrendChart.data = [monthlyData.data]; // data must be an array of arrays
            vm.monthlyTrendChart.series = ['Monthly Spend'];
            vm.monthlyTrendChart.options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) { return '€' + value; }
                        }
                    }]
                }
            };
        }

        /**
         * Retrieves a card object by its ID.
         * @param {number} cardId - The ID of the card to find.
         * @returns {object} The card object or an empty object if not found.
         */
        function getCardById(cardId) {
            return vm.cards.find(function(card) { return card.id === cardId; }) || {};
        }

        /**
         * Toggles the sort order for a given table column.
         * @param {string} column - The name of the column to sort by.
         */
        function sortData(column) {
            vm.sortReverse = (vm.sortColumn === column) ? !vm.sortReverse : false;
            vm.sortColumn = column;
        }

        /**
         * Determines which sort icon to display next to table headers.
         * @param {string} column - The name of the column.
         * @returns {string} The Font Awesome icon class.
         */
        function getSortIcon(column) {
            if (vm.sortColumn === column) {
                return vm.sortReverse ? 'fa-sort-down' : 'fa-sort-up';
            }
            return 'fa-sort';
        }

        /**
         * Exports the currently filtered transactions to a CSV file.
         */
        function exportToCSV() {
            var csvContent = 'data:text/csv;charset=utf-8,';
            // Headers
            csvContent += 'Date,Merchant,Category,Amount,Card Name,Status\r\n';

            vm.filteredTransactions.forEach(function(tx) {
                var cardName = vm.getCardById(tx.cardId).cardName;
                var row = [tx.date.toISOString().split('T')[0], tx.merchant, tx.category, tx.amount, cardName, tx.status].join(',');
                csvContent += row + '\r\n';
            });

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /**
         * Toggles the dark mode theme for the application.
         */
        function toggleDarkMode() {
            vm.isDarkMode = !vm.isDarkMode;
            // In a real app, this preference might be saved to localStorage or a user profile.
        }

        /**
         * Sets the selected transaction and opens the detail modal.
         * @param {object} transaction - The transaction object to display.
         */
        function showTransactionDetails(transaction) {
            vm.selectedTransaction = transaction;
            var modal = new bootstrap.Modal(document.getElementById('transactionDetailModal'));
            modal.show();
        }

        // --- Accounts: Function Implementations ---

        /**
         * Applies all active account filters and recalculates the accounts summary.
         */
        function applyAccountFilters() {
            vm.filteredAccountTransactions = dataService.getFilteredAccountTransactions(vm.accountFilters);
            vm.accountsSummary = dataService.getAccountsSummary(vm.accounts, vm.filteredAccountTransactions);
        }

        /**
         * Retrieves an account object by its ID.
         * @param {number} accountId - The ID of the account to find.
         * @returns {object} The account object or an empty object if not found.
         */
        function getAccountById(accountId) {
            return vm.accounts.find(function(account) { return account.id === accountId; }) || {};
        }

        /**
         * Toggles the sort order for a given account transactions table column.
         * @param {string} column - The name of the column to sort by.
         */
        function sortAccountData(column) {
            vm.accountSortReverse = (vm.accountSortColumn === column) ? !vm.accountSortReverse : false;
            vm.accountSortColumn = column;
        }

        /**
         * Determines which sort icon to display next to the account transactions table headers.
         * @param {string} column - The name of the column.
         * @returns {string} The Font Awesome icon class.
         */
        function getAccountSortIcon(column) {
            if (vm.accountSortColumn === column) {
                return vm.accountSortReverse ? 'fa-sort-down' : 'fa-sort-up';
            }
            return 'fa-sort';
        }

        /**
         * Exports the currently filtered account transactions to a CSV file.
         */
        function exportAccountsToCSV() {
            var csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Date,Description,Category,Type,Amount,Account,Balance After\r\n';

            vm.filteredAccountTransactions.forEach(function(tx) {
                var accountType = vm.getAccountById(tx.accountId).accountType;
                var row = [tx.date.toISOString().split('T')[0], tx.description, tx.category, tx.type, tx.amount, accountType, tx.balanceAfter].join(',');
                csvContent += row + '\r\n';
            });

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'account_transactions.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /**
         * Sets the selected account transaction and opens the detail modal.
         * @param {object} transaction - The account transaction object to display.
         */
        function showAccountTransactionDetails(transaction) {
            vm.selectedAccountTransaction = transaction;
            var modal = new bootstrap.Modal(document.getElementById('accountTransactionDetailModal'));
            modal.show();
        }
    }
})();