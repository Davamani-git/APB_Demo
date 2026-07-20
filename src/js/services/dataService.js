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
                "cardName": "Platinum Rewards Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-4567",
                "creditLimit": 500000,
                "availableCredit": 320000,
                "outstanding": 180000,
                "billingDate": "5",
                "dueDate": "25"
            },
            {
                "id": 2,
                "cardName": "Gold Travel Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-6789",
                "creditLimit": 300000,
                "availableCredit": 180000,
                "outstanding": 120000,
                "billingDate": "10",
                "dueDate": "30"
            },
            {
                "id": 3,
                "cardName": "Millennia Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 200000,
                "availableCredit": 130000,
                "outstanding": 70000,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        var transactions = generateMockTransactions(150);

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
            getTopSpendingGroups: getTopSpendingGroups
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
                'Flipkart': 'Shopping',
                'Swiggy': 'Food & Dining',
                'Zomato': 'Food & Dining',
                'Uber': 'Travel',
                'Ola': 'Travel',
                'Reliance Digital': 'Electronics',
                'Croma': 'Electronics',
                'BigBasket': 'Groceries',
                'BookMyShow': 'Entertainment',
                'MakeMyTrip': 'Travel',
                'Apollo Pharmacy': 'Healthcare',
                'Netflix': 'Entertainment',
                'BPCL Petrol Pump': 'Fuel',
                'BSES Bill': 'Utilities'
            };
            var merchantNames = Object.keys(merchants);

            for (var i = 0; i < count; i++) {
                var merchant = merchantNames[Math.floor(Math.random() * merchantNames.length)];
                var category = merchants[merchant];
                var amount = 0;

                switch (category) {
                    case 'Shopping': amount = Math.random() * 4000 + 500; break;
                    case 'Food & Dining': amount = Math.random() * 800 + 150; break;
                    case 'Travel': amount = Math.random() * 2500 + 200; break;
                    case 'Electronics': amount = Math.random() * 15000 + 2000; break;
                    case 'Groceries': amount = Math.random() * 3000 + 300; break;
                    case 'Entertainment': amount = Math.random() * 1000 + 299; break;
                    case 'Healthcare': amount = Math.random() * 1500 + 100; break;
                    case 'Fuel': amount = Math.random() * 2000 + 500; break;
                    case 'Utilities': amount = Math.random() * 4000 + 800; break;
                    default: amount = Math.random() * 1000 + 50;
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
    }
})();