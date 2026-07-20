/**
 * Data Service
 * Acts as the Model in the MVC architecture. It is responsible for fetching and managing all application data.
 * In a real-world application, this service would make HTTP requests to a backend API.
 * Here, it simulates API calls using promises ($q) and provides mock data.
 */
(function() {
    'use strict';

    angular.module('creditCardDashboardApp')
        .factory('dataService', ['$q', function($q) {

            // --- Mock Data --- //

            // Credit Card Data as per requirements
            var creditCards = [
                {
                    "id": 1,
                    "cardName": "Sapphire Rewards Card",
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
                    "cardName": "Platinum Travel Card",
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
                    "cardName": "Gold Lifestyle Card",
                    "bank": "Europe Bank",
                    "cardNumber": "XXXX-XXXX-XXXX-9876",
                    "creditLimit": 200000,
                    "availableCredit": 130000,
                    "outstanding": 70000,
                    "billingDate": "12",
                    "dueDate": "2"
                }
            ];

            // Function to generate realistic mock transactions
            function generateTransactions() {
                var transactions = [];
                var merchants = {
                    'Amazon': 'Shopping',
                    'Flipkart': 'Shopping',
                    'Swiggy': 'Food & Dining',
                    'Zomato': 'Food & Dining',
                    'Uber': 'Travel',
                    'Ola': 'Travel',
                    'Reliance Digital': 'Electronics',
                    'BigBasket': 'Groceries',
                    'BookMyShow': 'Entertainment',
                    'MakeMyTrip': 'Travel',
                    'Apollo Pharmacy': 'Healthcare',
                    'Croma': 'Electronics',
                    'Myntra': 'Shopping',
                    'Netflix': 'Entertainment',
                    'JioMart': 'Groceries'
                };
                var merchantKeys = Object.keys(merchants);

                for (var i = 1; i <= 100; i++) {
                    var randomMerchant = merchantKeys[Math.floor(Math.random() * merchantKeys.length)];
                    var randomCard = creditCards[Math.floor(Math.random() * creditCards.length)];
                    var randomDate = new Date();
                    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));

                    transactions.push({
                        id: 1000 + i,
                        date: randomDate.toISOString(),
                        merchant: randomMerchant,
                        category: merchants[randomMerchant],
                        amount: Math.floor(Math.random() * (10000 - 100 + 1)) + 100,
                        cardId: randomCard.id,
                        status: 'Completed',
                        remarks: 'Online payment'
                    });
                }
                return transactions;
            }

            var transactions = generateTransactions();

            // --- Service API --- //
            // The public methods exposed by this service.

            var service = {
                // Simulates fetching credit cards asynchronously
                getCreditCards: function() {
                    var deferred = $q.defer();
                    // Simulate network latency
                    setTimeout(function() {
                        deferred.resolve(creditCards);
                    }, 500);
                    return deferred.promise;
                },

                // Simulates fetching transactions asynchronously
                getTransactions: function() {
                    var deferred = $q.defer();
                    // Simulate network latency
                    setTimeout(function() {
                        deferred.resolve(transactions);
                    }, 800);
                    return deferred.promise;
                }
            };

            return service;
        }]);
})();