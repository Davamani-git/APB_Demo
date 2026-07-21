/*
Senior UI Engineer With PCI-DSS Compliance Expertise
Project: Credit Card Expenditure Dashboard
File: js/services/dataService.js
Description: Service to provide mock data for the application.
*/

(function() {
    'use strict';

    angular.module('creditCardDashboardApp').factory('dataService', dataService);

    function dataService() {

        // --- Private Data ---

        // Mock credit card data
        var creditCards = [
            {
                "id": 1,
                "cardName": "Platinum Card",
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
                "cardName": "Gold Rewards Card",
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
                "cardName": "Everyday Card",
                "bank": "Europe Bank",
                "cardNumber": "XXXX-XXXX-XXXX-9876",
                "creditLimit": 2000,
                "availableCredit": 1300,
                "outstanding": 700,
                "billingDate": "12",
                "dueDate": "2"
            }
        ];

        // Mock transaction data (generated on-the-fly)
        var transactions = [];

        /**
         * Generates a list of 100 realistic transactions.
         */
        function generateTransactions() {
            if (transactions.length > 0) return; // Generate only once

            var merchants = [
                { name: 'Amazon Spain', category: 'Shopping' },
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
                { name: 'Worten', category: 'Electronics' }
            ];

            for (var i = 1; i <= 100; i++) {
                var merchantInfo = merchants[Math.floor(Math.random() * merchants.length)];
                var card = creditCards[Math.floor(Math.random() * creditCards.length)];
                
                // Generate a random date within the last 12 months
                var date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365));
                date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

                transactions.push({
                    id: 1000 + i,
                    cardId: card.id,
                    date: date.toISOString(),
                    merchant: merchantInfo.name,
                    amount: parseFloat((Math.random() * (300 - 5) + 5).toFixed(2)),
                    category: merchantInfo.category
                });
            }
        }

        // --- Public Service API ---

        var service = {
            getCreditCards: getCreditCards,
            getTransactions: getTransactions
        };

        // Immediately generate the data upon service initialization
        generateTransactions();

        return service;

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
