/**
 * dataService.js
 * 
 * Service (Factory) for providing mock data to the application.
 * 
 * Architectural Decision: A dedicated service for data access is crucial. It abstracts the data source
 * from the controllers. This means if we were to switch from mock data to a real backend API,
 * we would only need to modify this file, and the controllers would remain unchanged. This adheres
 * to the Single Responsibility Principle and enhances testability and maintainability.
 * 
 * PCI-DSS Compliance Note: This service simulates fetching data. In a real-world, PCI-compliant
 * application, this service would make HTTPS calls to a secure, authenticated API endpoint.
 * It would never contain or generate sensitive data like full card numbers or CVV codes.
 * The card numbers here are masked as per PCI-DSS display requirements.
 */

(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .factory('dataService', dataService);

    // Injecting $q to simulate asynchronous API calls with promises.
    dataService.$inject = ['$q'];

    function dataService($q) {

        // --- Mock Data (Embedded) ---

        const mockCards = [
            {
                "id": 1,
                "cardName": "Platinum Rewards Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-4567",
                "creditLimit": 50000,
                "availableCredit": 32000,
                "outstanding": 18000,
                "billingDate": "5",
                "dueDate": "25"
            },
            {
                "id": 2,
                "cardName": "Gold Travel Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-6789",
                "creditLimit": 30000,
                "availableCredit": 18000,
                "outstanding": 12000,
                "billingDate": "10",
                "dueDate": "30"
            },
            {
                "id": 3,
                "cardName": "Digital Shopping Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 2000,
                "availableCredit": 1300,
                "outstanding": 700,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        // --- Service Interface ---
        var service = {
            getCards: getCards,
            getTransactions: getTransactions
        };

        return service;

        // --- Method Implementations ---

        /**
         * Returns a promise that resolves with the list of credit cards.
         * Simulates an async API call.
         */
        function getCards() {
            var deferred = $q.defer();
            // Simulate a network delay
            setTimeout(function() {
                deferred.resolve(angular.copy(mockCards));
            }, 100);
            return deferred.promise;
        }

        /**
         * Generates and returns a promise that resolves with a list of transactions.
         * Simulates an async API call.
         */
        function getTransactions() {
            var deferred = $q.defer();
            // Simulate a network delay
            setTimeout(function() {
                const transactions = generateMockTransactions(100, mockCards);
                deferred.resolve(transactions);
            }, 300);
            return deferred.promise;
        }

        // --- Private Helper Functions for Data Generation ---

        /**
         * Generates a realistic set of mock transactions.
         * @param {number} count - The number of transactions to generate.
         * @param {Array} cards - The list of cards to associate transactions with.
         * @returns {Array} An array of transaction objects.
         */
        function generateMockTransactions(count, cards) {
            const transactions = [];
            const merchants = {
                'Amazon Spain': { category: 'E-Commerce', amountRange: [15, 300] },
                'PcComponentes': { category: 'E-Commerce', amountRange: [50, 1500] },
                'Glovo': { category: 'Food & Dining', amountRange: [10, 45] },
                'Just Eat Spain': { category: 'Food & Dining', amountRange: [12, 50] },
                'Uber': { category: 'Transport', amountRange: [5, 60] },
                'Cabify': { category: 'Transport', amountRange: [6, 70] },
                'MediaMarkt Digital': { category: 'E-Commerce', amountRange: [20, 800] },
                'Mercadona Online': { category: 'Groceries', amountRange: [40, 250] },
                'Entradas': { category: 'Entertainment', amountRange: [25, 200] },
                'eDreams': { category: 'Travel', amountRange: [150, 2500] },
                'PromoFarma': { category: 'Health & Wellness', amountRange: [20, 120] },
                'Worten': { category: 'E-Commerce', amountRange: [30, 600] }
            };
            const merchantNames = Object.keys(merchants);

            for (let i = 0; i < count; i++) {
                const merchantName = merchantNames[Math.floor(Math.random() * merchantNames.length)];
                const merchantInfo = merchants[merchantName];
                const randomAmount = Math.random() * (merchantInfo.amountRange[1] - merchantInfo.amountRange[0]) + merchantInfo.amountRange[0];
                const randomDaysAgo = Math.floor(Math.random() * 365);
                const transactionDate = new Date();
                transactionDate.setDate(transactionDate.getDate() - randomDaysAgo);

                transactions.push({
                    id: i + 1,
                    date: transactionDate.toISOString(),
                    merchant: merchantName,
                    category: merchantInfo.category,
                    amount: parseFloat(randomAmount.toFixed(2)),
                    cardId: cards[Math.floor(Math.random() * cards.length)].id,
                    status: 'Completed',
                    remarks: ''
                });
            }
            return transactions;
        }
    }
})();
