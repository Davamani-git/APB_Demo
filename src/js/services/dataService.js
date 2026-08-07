/*
File: dataService.js
Description: AngularJS service to provide mock data for credit cards and transactions.
Author: Senior UI Engineer
Date: 2024-07-25
*/

app.factory('dataService', ['$timeout', '$q', function($timeout, $q) {

    // Mock data for credit cards
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
            "cardName": "Gold Rewards",
            "bank": "Iberia Bank",
            "cardNumber": "XXXX-XXXX-XXXX-6789",
            "creditLimit": 30000,
            "availableCredit": 18000,
            "outstanding": 12000,
            "billingDate": "10",
            "dueDate": "30"
        },
        {
            "id": 3,
            "cardName": "Student Card",
            "bank": "Digital Bank ES",
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
        var merchants = ['Amazon Spain', 'PcComponentes', 'Glovo', 'Just Eat Spain', 'Uber', 'Cabify', 'MediaMarkt Digital', 'Mercadona Online', 'Entradas', 'eDreams', 'PromoFarma', 'Worten'];
        var categories = {
            'Amazon Spain': 'Shopping',
            'PcComponentes': 'Shopping',
            'Glovo': 'Food',
            'Just Eat Spain': 'Food',
            'Uber': 'Transport',
            'Cabify': 'Transport',
            'MediaMarkt Digital': 'Shopping',
            'Mercadona Online': 'Food',
            'Entradas': 'Entertainment',
            'eDreams': 'Travel',
            'PromoFarma': 'Healthcare',
            'Worten': 'Shopping',
        };
        var statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Failed'];

        for (var i = 1; i <= 100; i++) {
            var randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
            var randomCard = creditCards[Math.floor(Math.random() * creditCards.length)];
            var randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Generate a random date in the last 12 months
            var date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));

            transactions.push({
                id: 1000 + i,
                date: date,
                merchant: randomMerchant,
                amount: parseFloat((Math.random() * (500 - 5) + 5).toFixed(2)),
                category: categories[randomMerchant] || 'Miscellaneous',
                cardId: randomCard.id,
                status: randomStatus,
                remarks: 'Online purchase'
            });
        }
        return transactions;
    }

    var transactions = generateTransactions();

    // Service interface
    var service = {
        // Simulates an async API call to get credit cards
        getCreditCards: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(creditCards);
            }, 500); // Simulate network latency
            return deferred.promise;
        },
        // Simulates an async API call to get transactions
        getTransactions: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(transactions);
            }, 800); // Simulate network latency
            return deferred.promise;
        }
    };

    return service;
}]);