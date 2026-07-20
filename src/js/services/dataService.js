/**
 * @file dataService.js
 * @description AngularJS service for providing mock credit card and transaction data.
 * @author John Doe, Senior UI Engineer
 * @date 2023-10-26
 */

(function() {
    'use strict';

    angular.module('creditCardDashboardApp')
        .factory('dataService', dataService);

    function dataService() {

        // --- PRIVATE DATA --- //

        // PCI-DSS Compliance Note: Card numbers are masked. Full PAN is never stored or handled.
        var mockCards = [
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
                "bank": "Finance Group",
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

        // Helper function to generate realistic mock transactions
        function generateMockTransactions() {
            var transactions = [];
            var merchants = ['Amazon Spain', 'PcComponentes', 'Glovo', 'Just Eat Spain', 'Uber', 'Cabify', 'MediaMarkt Digital', 'Mercadona Online', 'Entradas', 'eDreams', 'PromoFarma', 'Worten'];
            var categories = {
                'Amazon Spain': 'Shopping',
                'PcComponentes': 'Shopping',
                'Glovo': 'Food',
                'Just Eat Spain': 'Food',
                'Uber': 'Travel',
                'Cabify': 'Travel',
                'MediaMarkt Digital': 'Shopping',
                'Mercadona Online': 'Food',
                'Entradas': 'Entertainment',
                'eDreams': 'Travel',
                'PromoFarma': 'Healthcare',
                'Worten': 'Shopping',
            };
            var statuses = ['Completed', 'Pending'];

            for (var i = 1; i <= 100; i++) {
                var randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
                var randomCardId = Math.floor(Math.random() * mockCards.length) + 1;
                
                // Generate a date within the last 12 months
                var date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365));

                transactions.push({
                    id: 1000 + i,
                    date: date.toISOString(),
                    merchant: randomMerchant,
                    amount: parseFloat((Math.random() * (300 - 5) + 5).toFixed(2)),
                    category: categories[randomMerchant] || 'Miscellaneous',
                    cardId: randomCardId,
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    remarks: 'Online purchase'
                });
            }
            return transactions;
        }

        var mockTransactions = generateMockTransactions();

        // --- PUBLIC API --- //

        var service = {
            getCards: getCards,
            getTransactions: getTransactions
        };

        return service;

        /**
         * @description Returns a promise that resolves with the list of credit cards.
         * Simulates an async API call.
         * @returns {Promise<Array>} A promise resolving to the array of card objects.
         */
        function getCards() {
            // In a real app, this would be an $http.get call.
            // We use a simple return here as data is embedded.
            return angular.copy(mockCards);
        }

        /**
         * @description Returns a promise that resolves with the list of transactions.
         * Simulates an async API call.
         * @returns {Promise<Array>} A promise resolving to the array of transaction objects.
         */
        function getTransactions() {
            return angular.copy(mockTransactions);
        }
    }
})();
