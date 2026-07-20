/**
 * Data Service
 * Acts as a mock backend, providing data to the application.
 * Uses promises to simulate asynchronous API calls.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .factory('dataService', dataService);

    // Inject dependencies
    dataService.$inject = ['$q', '$timeout'];

    function dataService($q, $timeout) {
        // --- MOCK DATA --- //

        const creditCards = [
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
                "cardName": "Millennia Shopping Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 200000,
                "availableCredit": 130000,
                "outstanding": 70000,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        // --- SERVICE INTERFACE --- //

        var service = {
            getCards: getCards,
            getTransactions: getTransactions
        };

        return service;

        // --- FUNCTION DEFINITIONS --- //

        /**
         * Returns a promise that resolves with the list of credit cards.
         * @returns {Promise} A promise that resolves to an array of card objects.
         */
        function getCards() {
            var deferred = $q.defer();
            // Simulate API latency
            $timeout(function() {
                deferred.resolve(creditCards);
            }, 200);
            return deferred.promise;
        }

        /**
         * Returns a promise that resolves with a generated list of transactions.
         * @returns {Promise} A promise that resolves to an array of transaction objects.
         */
        function getTransactions() {
            var deferred = $q.defer();
            // Simulate API latency
            $timeout(function() {
                deferred.resolve(generateMockTransactions());
            }, 400);
            return deferred.promise;
        }

        /**
         * Generates a realistic set of mock transactions.
         * @returns {Array} An array of transaction objects.
         */
        function generateMockTransactions() {
            const transactions = [];
            const merchantsByCategory = {
                'Shopping': ['Amazon', 'Flipkart', 'Reliance Digital', 'Croma'],
                'Food & Dining': ['Swiggy', 'Zomato', 'BigBasket'],
                'Travel': ['Uber', 'Ola', 'MakeMyTrip'],
                'Entertainment': ['BookMyShow'],
                'Healthcare': ['Apollo Pharmacy'],
                'Utilities': ['Electricity Bill', 'Water Bill'],
                'Fuel': ['Indian Oil', 'HP Petrol Pump'],
                'Miscellaneous': ['Local Store', 'Gift Shop']
            };
            const categories = Object.keys(merchantsByCategory);
            const today = new Date();
            const numTransactions = 120; // Generate 120 transactions

            for (let i = 1; i <= numTransactions; i++) {
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const possibleMerchants = merchantsByCategory[randomCategory];
                const randomMerchant = possibleMerchants[Math.floor(Math.random() * possibleMerchants.length)];
                
                // Generate a date within the last 12 months
                const randomDaysAgo = Math.floor(Math.random() * 365);
                const transactionDate = new Date();
                transactionDate.setDate(today.getDate() - randomDaysAgo);

                let amount;
                switch (randomCategory) {
                    case 'Travel': amount = Math.random() * (1500 - 200) + 200; break;
                    case 'Shopping': amount = Math.random() * (10000 - 500) + 500; break;
                    case 'Healthcare': amount = Math.random() * (2000 - 150) + 150; break;
                    default: amount = Math.random() * (800 - 100) + 100;
                }

                transactions.push({
                    id: i,
                    date: transactionDate.toISOString(),
                    merchant: randomMerchant,
                    category: randomCategory,
                    amount: parseFloat(amount.toFixed(2)),
                    cardId: Math.floor(Math.random() * 3) + 1, // Assign to one of the 3 cards
                    status: Math.random() > 0.1 ? 'Completed' : 'Pending',
                    remarks: ''
                });
            }
            return transactions;
        }
    }
})();