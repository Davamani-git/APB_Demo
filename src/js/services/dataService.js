/**
 * Data Service for the Credit Card Dashboard.
 * This service is the single source of truth for all application data.
 * It simulates fetching data from a backend API.
 *
 * PCI-DSS Compliance Note: In a production environment, this service would communicate
 * over HTTPS with a secure, authenticated, and tokenized API. Raw Primary Account Numbers (PANs)
 * would NEVER be transmitted to or stored on the client-side. The card numbers here are
 * masked and for display purposes only.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .factory('dataService', dataService);

    dataService.$inject = ['$q', '$timeout'];

    function dataService($q, $timeout) {

        // --- Mock Data --- //

        var creditCards = [
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
                "cardName": "Traveler's Choice",
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
                "cardName": "Everyday Cashback",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 2000,
                "availableCredit": 1300,
                "outstanding": 700,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        // Function to generate realistic mock transactions
        function generateTransactions() {
            var transactions = [];
            var merchants = [
                { name: 'Amazon Spain', category: 'Electronics' },
                { name: 'PcComponentes', category: 'Electronics' },
                { name: 'Glovo', category: 'Food Delivery' },
                { name: 'Just Eat Spain', category: 'Food Delivery' },
                { name: 'Uber', category: 'Transport' },
                { name: 'Cabify', category: 'Transport' },
                { name: 'MediaMarkt Digital', category: 'Electronics' },
                { name: 'Mercadona Online', category: 'Groceries' },
                { name: 'Entradas', category: 'Entertainment' },
                { name: 'eDreams', category: 'Travel' },
                { name: 'PromoFarma', category: 'Health' },
                { name: 'Worten', category: 'Home Goods' }
            ];

            for (var i = 1; i <= 100; i++) {
                var randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
                var randomCard = creditCards[Math.floor(Math.random() * creditCards.length)];
                var randomDate = new Date();
                randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));

                var amount = 0;
                switch (randomMerchant.category) {
                    case 'Travel': amount = Math.random() * 800 + 200; break;
                    case 'Electronics': amount = Math.random() * 500 + 50; break;
                    case 'Groceries': amount = Math.random() * 100 + 20; break;
                    case 'Food Delivery': amount = Math.random() * 30 + 10; break;
                    default: amount = Math.random() * 70 + 5;
                }

                transactions.push({
                    id: 'TX' + (1000 + i),
                    date: randomDate.toISOString(),
                    merchant: randomMerchant.name,
                    amount: parseFloat(amount.toFixed(2)),
                    category: randomMerchant.category,
                    cardId: randomCard.id
                });
            }
            return transactions;
        }

        var transactions = generateTransactions();

        // --- Service API --- //

        var service = {
            getCards: getCards,
            getTransactions: getTransactions
        };

        return service;

        /**
         * Simulates an API call to fetch credit card data.
         * @returns {Promise} A promise that resolves with the credit card array.
         */
        function getCards() {
            var deferred = $q.defer();
            // Simulate network latency
            $timeout(function() {
                deferred.resolve(creditCards);
            }, 500);
            return deferred.promise;
        }

        /**
         * Simulates an API call to fetch transaction data.
         * @returns {Promise} A promise that resolves with the transaction array.
         */
        function getTransactions() {
            var deferred = $q.defer();
            // Simulate network latency
            $timeout(function() {
                // In a real app, we'd join card data on the backend.
                // Here, we do it client-side for demonstration.
                var populatedTransactions = transactions.map(function(tx) {
                    tx.card = creditCards.find(function(c) { return c.id === tx.cardId; });
                    return tx;
                });
                deferred.resolve(populatedTransactions);
            }, 800);
            return deferred.promise;
        }
    }
})();
