/**
 * Data Service
 * 
 * This service is responsible for providing all the mock data for the application.
 * In a real-world application, this service would make HTTP requests to a backend API to fetch the data.
 * Encapsulating data access in a service makes the application more modular and easier to maintain.
 */
(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp')
        .factory('dataService', dataService);

    function dataService() {

        // --- Mock Data --- //

        const creditCards = [
            {
                "id": 1,
                "cardName": "Credit Card 1",
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
                "cardName": "Credit Card 2",
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
                "cardName": "Credit Card 3",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 2000,
                "availableCredit": 1300,
                "outstanding": 700,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        // Function to generate mock transactions
        function generateTransactions() {
            const transactions = [];
            const merchants = [
                { name: 'Amazon Spain', category: 'Shopping' },
                { name: 'PcComponentes', category: 'Shopping' },
                { name: 'Glovo', category: 'Food Delivery' },
                { name: 'Just Eat Spain', category: 'Food Delivery' },
                { name: 'Uber', category: 'Transport' },
                { name: 'Cabify', category: 'Transport' },
                { name: 'MediaMarkt Digital', category: 'Shopping' },
                { name: 'Mercadona Online', category: 'Groceries' },
                { name: 'Entradas', category: 'Entertainment' },
                { name: 'eDreams', category: 'Travel' },
                { name: 'PromoFarma', category: 'Health' },
                { name: 'Worten', category: 'Shopping' },
                { name: 'Repsol', category: 'Transport' },
                { name: 'El Corte Inglés', category: 'Shopping' },
                { name: 'Netflix', category: 'Bills' },
                { name: 'Spotify', category: 'Bills' }
            ];

            for (let i = 1; i <= 100; i++) {
                const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
                const randomCardId = Math.floor(Math.random() * 3) + 1;
                
                // Generate a date in the last 12 months
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365));

                transactions.push({
                    id: i,
                    date: date.toISOString(),
                    merchant: randomMerchant.name,
                    amount: parseFloat((Math.random() * (250 - 5) + 5).toFixed(2)),
                    category: randomMerchant.category,
                    cardId: randomCardId,
                    reference: 'REF' + Date.now().toString().slice(-6) + i
                });
            }
            return transactions;
        }

        const transactions = generateTransactions();

        // --- Service API --- //

        const service = {
            getCreditCards: getCreditCards,
            getTransactions: getTransactions
        };

        return service;

        // --- Function Definitions --- //

        /**
         * @returns {Array} The list of credit cards.
         */
        function getCreditCards() {
            return creditCards;
        }

        /**
         * @returns {Array} The list of generated transactions.
         */
        function getTransactions() {
            return transactions;
        }
    }
})();