/**
 * Data Service
 * @service dataService
 * 
 * This service acts as a mock backend. It provides all necessary data (cards, transactions)
 * and contains the business logic for filtering, aggregation, and calculations.
 * In a real-world application, this service would make HTTP requests to a secure backend API.
 * PCI-DSS Compliance Note: All interactions with a backend must be over a secure channel (HTTPS).
 * Sensitive data like full card numbers should never be handled or stored on the client-side.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .factory('dataService', dataService);

    function dataService() {
        // --- Mock Data --- 
        // In a real app, this data would be fetched from a secure API.
        var cards = [
            {
                "id": 1,
                "cardName": "Santander 123 Credit Card",
                "bank": "Santander",
                "network": "visa",
                "cardNumber": "XXXX-XXXX-XXXX-4567",
                "creditLimit": 8000,
                "availableCredit": 5200,
                "outstanding": 2800,
                "billingDate": "5",
                "dueDate": "25"
            },
            {
                "id": 2,
                "cardName": "Santander World Elite Mastercard",
                "bank": "Santander",
                "network": "mastercard",
                "cardNumber": "XXXX-XXXX-XXXX-6789",
                "creditLimit": 15000,
                "availableCredit": 9500,
                "outstanding": 5500,
                "billingDate": "10",
                "dueDate": "30"
            },
            {
                "id": 3,
                "cardName": "Santander Zero Credit Card",
                "bank": "Santander",
                "network": "visa",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 5000,
                "availableCredit": 3200,
                "outstanding": 1800,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        var transactions = generateMockTransactions(150);

        var accounts = [
            {
                "id": 1,
                "accountType": "Santander Cuenta 1|2|3",
                "bank": "Santander",
                "accountNumber": "XXXXXXXX4521",
                "iban": "ES91 XXXX XXXX XXXX 4521",
                "branch": "Madrid - Gran Vía Branch",
                "balance": 24500,
                "openDate": "2019-03-15"
            },
            {
                "id": 2,
                "accountType": "Santander Current Account",
                "bank": "Santander",
                "accountNumber": "XXXXXXXX7890",
                "iban": "ES91 XXXX XXXX XXXX 7890",
                "branch": "Barcelona - Passeig de Gràcia Branch",
                "balance": 58000,
                "openDate": "2021-07-01"
            },
            {
                "id": 3,
                "accountType": "Santander Select Account",
                "bank": "Santander",
                "accountNumber": "XXXXXXXX3345",
                "iban": "ES91 XXXX XXXX XXXX 3345",
                "branch": "Valencia Branch",
                "balance": 13200,
                "openDate": "2022-01-10"
            }
        ];

        var accountTransactions = generateMockAccountTransactions(150);

        // --- Service API ---
        var service = {
            getCards: getCards,
            getTransactions: getTransactions,
            getFilteredTransactions: getFilteredTransactions,
            getUniqueCategories: getUniqueCategories,
            getDashboardSummary: getDashboardSummary,
            getCategorySpending: getCategorySpending,
            getMonthlySpendingTrend: getMonthlySpendingTrend,
            getMonthlySpendForecast: getMonthlySpendForecast,
            getTopSpendingGroups: getTopSpendingGroups,
            getAccounts: getAccounts,
            getAccountTransactions: getAccountTransactions,
            getFilteredAccountTransactions: getFilteredAccountTransactions,
            getUniqueAccountCategories: getUniqueAccountCategories,
            getAccountsSummary: getAccountsSummary
        };

        return service;

        // --- Function Implementations ---

        function getCards() {
            return cards;
        }

        function getTransactions() {
            return transactions;
        }

        /**
         * Filters transactions based on the provided criteria.
         * @param {object} filters - The filter criteria (merchant, category, cardId, startDate, endDate).
         * @returns {Array} The filtered list of transactions.
         */
        function getFilteredTransactions(filters) {
            return transactions.filter(function(tx) {
                var match = true;
                if (filters.merchant) {
                    match = match && tx.merchant.toLowerCase().includes(filters.merchant.toLowerCase());
                }
                if (filters.category) {
                    match = match && tx.category === filters.category;
                }
                if (filters.cardId) {
                    match = match && tx.cardId == filters.cardId;
                }
                if (filters.startDate) {
                    match = match && tx.date >= filters.startDate;
                }
                if (filters.endDate) {
                    // Add 1 day to endDate to include the full day
                    var inclusiveEndDate = new Date(filters.endDate);
                    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
                    match = match && tx.date < inclusiveEndDate;
                }
                return match;
            });
        }

        /**
         * Calculates summary metrics for the dashboard.
         * @param {Array} allCards - The list of all credit cards.
         * @param {Array} filteredTransactions - The currently filtered transactions.
         * @returns {object} An object containing summary metrics.
         */
        function getDashboardSummary(allCards, filteredTransactions) {
            var summary = {
                totalLimit: 0,
                totalOutstanding: 0,
                totalAvailable: 0,
                monthlySpend: 0,
                utilization: 0
            };

            allCards.forEach(function(card) {
                summary.totalLimit += card.creditLimit;
                summary.totalOutstanding += card.outstanding;
                summary.totalAvailable += card.availableCredit;
            });

            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();

            filteredTransactions.forEach(function(tx) {
                if (tx.date.getMonth() === currentMonth && tx.date.getFullYear() === currentYear) {
                    summary.monthlySpend += tx.amount;
                }
            });

            if (summary.totalLimit > 0) {
                summary.utilization = (summary.totalOutstanding / summary.totalLimit) * 100;
            }

            return summary;
        }

        /**
         * Aggregates spending by category.
         * @param {Array} transactions - The list of transactions to analyze.
         * @returns {object} An object with 'labels' and 'data' for a chart.
         */
        function getCategorySpending(transactions) {
            var spending = {};
            transactions.forEach(function(tx) {
                spending[tx.category] = (spending[tx.category] || 0) + tx.amount;
            });

            return {
                labels: Object.keys(spending),
                data: Object.values(spending)
            };
        }

        /**
         * Calculates total spending for each of the last 12 months.
         * @param {Array} transactions - The list of all transactions.
         * @returns {object} An object with 'labels' and 'data' for a line chart.
         */
        function getMonthlySpendingTrend(transactions) {
            var trend = {};
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var today = new Date();

            // Initialize last 12 months
            for (var i = 11; i >= 0; i--) {
                var d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                var key = monthNames[d.getMonth()] + " '" + d.getFullYear().toString().substr(-2);
                trend[key] = 0;
            }

            transactions.forEach(function(tx) {
                var d = tx.date;
                var key = monthNames[d.getMonth()] + " '" + d.getFullYear().toString().substr(-2);
                if (trend.hasOwnProperty(key)) {
                    trend[key] += tx.amount;
                }
            });

            return {
                labels: Object.keys(trend),
                data: Object.values(trend)
            };
        }

        /**
         * Calculates a simple linear forecast for the current month's total spend.
         * @param {Array} allTransactions - The list of all transactions.
         * @returns {number} The forecasted spend for the current month.
         */
        function getMonthlySpendForecast(allTransactions) {
            var today = new Date();
            var currentDay = today.getDate();
            var daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            var currentMonthSpend = 0;

            allTransactions.forEach(function(tx) {
                if (tx.date.getMonth() === today.getMonth() && tx.date.getFullYear() === today.getFullYear()) {
                    currentMonthSpend += tx.amount;
                }
            });

            if (currentDay === 0 || currentMonthSpend === 0) return 0;

            var dailyAverage = currentMonthSpend / currentDay;
            return dailyAverage * daysInMonth;
        }

        /**
         * Gets the top N spending groups (e.g., by category or merchant).
         * @param {Array} transactions - The list of transactions to analyze.
         * @param {string} groupBy - The property to group by ('category' or 'merchant').
         * @param {number} count - The number of top groups to return.
         * @returns {Array} A sorted array of top spending groups.
         */
        function getTopSpendingGroups(transactions, groupBy, count) {
            var groups = {};
            transactions.forEach(function(tx) {
                var key = tx[groupBy];
                groups[key] = (groups[key] || 0) + tx.amount;
            });

            var sorted = Object.keys(groups).map(function(key) {
                var item = {};
                item[groupBy] = key;
                item.amount = groups[key];
                return item;
            });

            sorted.sort(function(a, b) { return b.amount - a.amount; });

            return sorted.slice(0, count);
        }

        /**
         * Gets a list of unique category names from all transactions.
         * @returns {Array} An array of unique category strings.
         */
        function getUniqueCategories() {
            var categories = transactions.map(function(tx) { return tx.category; });
            return [...new Set(categories)].sort();
        }

        /**
         * Generates a list of realistic mock transactions.
         * @param {number} count - The number of transactions to generate.
         * @returns {Array} A list of transaction objects.
         */
        function generateMockTransactions(count) {
            var generatedTransactions = [];
            var merchants = {
                'Amazon': 'Shopping',
                'Zalando': 'Shopping',
                'Deliveroo': 'Food & Dining',
                'Just Eat': 'Food & Dining',
                'Uber': 'Travel',
                'Bolt': 'Travel',
                'MediaMarkt': 'Electronics',
                'Fnac': 'Electronics',
                'Carrefour': 'Groceries',
                'Ticketmaster': 'Entertainment',
                'Booking.com': 'Travel',
                'Farmacia Central': 'Healthcare',
                'Netflix': 'Entertainment',
                'Repsol': 'Fuel',
                'Iberdrola': 'Utilities'
            };
            var merchantNames = Object.keys(merchants);

            for (var i = 0; i < count; i++) {
                var merchant = merchantNames[Math.floor(Math.random() * merchantNames.length)];
                var category = merchants[merchant];
                var amount = 0;

                switch (category) {
                    case 'Shopping': amount = Math.random() * 130 + 20; break;
                    case 'Food & Dining': amount = Math.random() * 32 + 8; break;
                    case 'Travel': amount = Math.random() * 105 + 15; break;
                    case 'Electronics': amount = Math.random() * 750 + 50; break;
                    case 'Groceries': amount = Math.random() * 130 + 20; break;
                    case 'Entertainment': amount = Math.random() * 32 + 8; break;
                    case 'Healthcare': amount = Math.random() * 70 + 10; break;
                    case 'Fuel': amount = Math.random() * 60 + 30; break;
                    case 'Utilities': amount = Math.random() * 140 + 40; break;
                    default: amount = Math.random() * 50 + 10;
                }

                generatedTransactions.push({
                    id: 'TXN' + (10000 + i),
                    date: new Date(new Date() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                    merchant: merchant,
                    category: category,
                    amount: parseFloat(amount.toFixed(2)),
                    cardId: Math.floor(Math.random() * 3) + 1, // Assign to card 1, 2, or 3
                    status: Math.random() > 0.1 ? 'Completed' : 'Pending',
                    remarks: ''
                });
            }
            return generatedTransactions;
        }

        // --- Accounts: Function Implementations ---

        function getAccounts() {
            return accounts;
        }

        function getAccountTransactions() {
            return accountTransactions;
        }

        /**
         * Filters account transactions based on the provided criteria.
         * @param {object} filters - The filter criteria (description, category, accountId, startDate, endDate).
         * @returns {Array} The filtered list of account transactions.
         */
        function getFilteredAccountTransactions(filters) {
            return accountTransactions.filter(function(tx) {
                var match = true;
                if (filters.description) {
                    match = match && tx.description.toLowerCase().includes(filters.description.toLowerCase());
                }
                if (filters.category) {
                    match = match && tx.category === filters.category;
                }
                if (filters.accountId) {
                    match = match && tx.accountId == filters.accountId;
                }
                if (filters.startDate) {
                    match = match && tx.date >= filters.startDate;
                }
                if (filters.endDate) {
                    var inclusiveEndDate = new Date(filters.endDate);
                    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
                    match = match && tx.date < inclusiveEndDate;
                }
                return match;
            });
        }

        /**
         * Gets a list of unique transaction category names from all account transactions.
         * @returns {Array} An array of unique category strings.
         */
        function getUniqueAccountCategories() {
            var categories = accountTransactions.map(function(tx) { return tx.category; });
            return [...new Set(categories)].sort();
        }

        /**
         * Calculates summary metrics for the Accounts section.
         * @param {Array} allAccounts - The list of all bank accounts.
         * @param {Array} filteredTransactions - The currently filtered account transactions.
         * @returns {object} An object containing summary metrics.
         */
        function getAccountsSummary(allAccounts, filteredTransactions) {
            var summary = {
                totalBalance: 0,
                totalAccounts: allAccounts.length,
                monthlyCredits: 0,
                monthlyDebits: 0,
                netFlow: 0
            };

            allAccounts.forEach(function(account) {
                summary.totalBalance += account.balance;
            });

            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();

            filteredTransactions.forEach(function(tx) {
                if (tx.date.getMonth() === currentMonth && tx.date.getFullYear() === currentYear) {
                    if (tx.type === 'Credit') {
                        summary.monthlyCredits += tx.amount;
                    } else {
                        summary.monthlyDebits += tx.amount;
                    }
                }
            });

            summary.netFlow = summary.monthlyCredits - summary.monthlyDebits;

            return summary;
        }

        /**
         * Generates a list of realistic mock account (bank statement) transactions.
         * @param {number} count - The number of transactions to generate.
         * @returns {Array} A list of account transaction objects.
         */
        function generateMockAccountTransactions(count) {
            var generatedTransactions = [];
            var categoryMap = {
                'Salary Credit': { type: 'Credit', min: 1800, max: 4500, refs: ['Acme Europe S.L.', 'Globex GmbH', 'Initech Ltd'] },
                'Interest Credit': { type: 'Credit', min: 1, max: 15, refs: ['Cuenta Interest'] },
                'Cheque Deposit': { type: 'Credit', min: 100, max: 1500, refs: ['Cheque Deposit'] },
                'Refund': { type: 'Credit', min: 10, max: 150, refs: ['Amazon Refund', 'Zalando Refund', 'Zara Refund'] },
                'ATM Withdrawal': { type: 'Debit', min: 20, max: 300, refs: ['ATM - Gran Vía', 'ATM - Passeig de Gràcia', 'ATM - Valencia Centro'] },
                'Fund Transfer': { type: 'Debit', min: 20, max: 1200, refs: ['SEPA to Laura Martínez', 'Bizum to Carlos Ruiz', 'Transfer to Landlord'] },
                'Bill Payment': { type: 'Debit', min: 15, max: 250, refs: ['Iberdrola', 'Naturgy', 'Movistar'] },
                'Bizum Payment': { type: 'Debit', min: 5, max: 100, refs: ['Deliveroo', 'Just Eat', 'Carrefour', 'Local Store'] },
                'POS Purchase': { type: 'Debit', min: 15, max: 200, refs: ['Zara', 'El Corte Inglés', 'MediaMarkt'] }
            };
            var categoryNames = Object.keys(categoryMap);

            for (var i = 0; i < count; i++) {
                var category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
                var meta = categoryMap[category];
                var reference = meta.refs[Math.floor(Math.random() * meta.refs.length)];
                var amount = Math.random() * (meta.max - meta.min) + meta.min;
                var accountId = Math.floor(Math.random() * 3) + 1; // Assign to account 1, 2, or 3
                var account = accounts.filter(function(acc) { return acc.id === accountId; })[0];

                generatedTransactions.push({
                    id: 'ACCTXN' + (10000 + i),
                    date: new Date(new Date() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                    description: reference,
                    category: category,
                    type: meta.type,
                    amount: parseFloat(amount.toFixed(2)),
                    accountId: accountId,
                    balanceAfter: parseFloat((account.balance + (Math.random() * 2000 - 1000)).toFixed(2))
                });
            }
            return generatedTransactions;
        }
    }
})();