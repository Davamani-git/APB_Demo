/**
 * Data Service
 * Role: Acts as the Model in the MVC architecture.
 * Responsibility: Manages all data, including fetching and generation.
 * Design Choice: This service uses `$q` to simulate asynchronous API calls. This is a critical design pattern.
 * It allows the controller to be written as if it's consuming a real backend API, making future integration seamless.
 * All mock data is encapsulated here, ensuring controllers and views are data-agnostic.
 */

(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp.services')
        .factory('dataService', dataService);

    dataService.$inject = ['$q'];

    function dataService($q) {

        // --- Mock Data Definitions ---

        // PCI-DSS Compliance Note: Card numbers are pre-masked. Full PANs should never exist on the client-side.
        var cards = [
            {
                "id": 1,
                "cardName": "Platinum Rewards",
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
                "cardName": "Gold Cashback",
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
                "cardName": "Digital Shopper",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 2000,
                "availableCredit": 1300,
                "outstanding": 700,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        var transactions = generateMockTransactions(100);

        // --- Service Public API ---

        var service = {
            getCards: getCards,
            getTransactions: getTransactions
        };

        return service;

        // --- Function Implementations ---

        /**
         * Returns a promise that resolves with the list of credit cards.
         * Simulates an async API call.
         */
        function getCards() {
            var deferred = $q.defer();
            // Simulate network latency
            setTimeout(function() {
                deferred.resolve(angular.copy(cards));
            }, 500);
            return deferred.promise;
        }

        /**
         * Returns a promise that resolves with the list of transactions.
         * Simulates an async API call.
         */
        function getTransactions() {
            var deferred = $q.defer();
            // Simulate network latency
            setTimeout(function() {
                deferred.resolve(angular.copy(transactions));
            }, 800);
            return deferred.promise;
        }

        /**
         * Generates a realistic set of mock transactions.
         * @param {number} count - The number of transactions to generate.
         * @returns {Array} An array of transaction objects.
         */
        function generateMockTransactions(count) {
            var generatedTransactions = [];
            var merchants = [
                { name: 'Amazon Spain', category: 'Shopping' },
                { name: 'PcComponentes', category: 'Shopping' },
                { name: 'Glovo', category: 'Food & Dining' },
                { name: 'Just Eat Spain', category: 'Food & Dining' },
                { name: 'Uber', category: 'Transport' },
                { name: 'Cabify', category: 'Transport' },
                { name: 'MediaMarkt Digital', category: 'Shopping' },
                { name: 'Mercadona Online', category: 'Food & Dining' },
                { name: 'Entradas', category: 'Entertainment' },
                { name: 'eDreams', category: 'Travel' },
                { name: 'PromoFarma', category: 'Healthcare' },
                { name: 'Worten', category: 'Shopping' },
                { name: 'Repsol Fuel', category: 'Transport' },
                { name: 'Netflix', category: 'Entertainment' },
                { name: 'Iberdrola', category: 'Utilities' }
            ];

            for (var i = 0; i < count; i++) {
                var merchant = merchants[Math.floor(Math.random() * merchants.length)];
                var date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365)); // Transactions within the last year

                generatedTransactions.push({
                    id: 1000 + i,
                    date: date.toISOString(),
                    merchant: merchant.name,
                    category: merchant.category,
                    amount: parseFloat((Math.random() * (250 - 5) + 5).toFixed(2)), // Amount between 5 and 250
                    cardId: Math.floor(Math.random() * 3) + 1, // Assign to one of the 3 cards
                    status: Math.random() > 0.1 ? 'Completed' : 'Pending', // 90% completed
                    remarks: 'Online Purchase'
                });
            }
            return generatedTransactions;
        }
    }
})();