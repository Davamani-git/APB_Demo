/*
Senior UI Engineer With PCI-DSS Compliance Expertise
Project: Credit Card Expenditure Dashboard
File: js/services/dataService.js (Mock Data Service)
*/

angular.module('creditCardDashboardApp').factory('dataService', ['$timeout', '$q', function($timeout, $q) {
    
    // Mock data for credit cards as per requirements
    const cards = [
        {
            id: 1, cardName: "Credit Card 1", bank: "Europe Bank", cardNumber: "XXXX-XXXX-XXXX-4567",
            creditLimit: 500000, availableCredit: 320000, outstanding: 180000, billingDate: "5", dueDate: "25"
        },
        {
            id: 2, cardName: "Credit Card 2", bank: "Europe Bank", cardNumber: "XXXX-XXXX-XXXX-6789",
            creditLimit: 300000, availableCredit: 180000, outstanding: 120000, billingDate: "10", dueDate: "30"
        },
        {
            id: 3, cardName: "Credit Card 3", bank: "Asia Bank", cardNumber: "XXXX-XXXX-XXXX-9876",
            creditLimit: 200000, availableCredit: 130000, outstanding: 70000, billingDate: "12", dueDate: "2"
        }
    ];

    // Function to generate realistic mock transactions
    function generateTransactions() {
        const transactions = [];
        const categories = ["Food & Dining", "Fuel", "Shopping", "Travel", "Entertainment", "Utilities", "Healthcare", "Education", "Miscellaneous"];
        const merchants = {
            "Food & Dining": ["Swiggy", "Zomato", "BigBasket"],
            "Shopping": ["Amazon", "Flipkart", "Croma", "Reliance Digital"],
            "Travel": ["MakeMyTrip", "Uber", "Ola"],
            "Entertainment": ["BookMyShow", "PVR Cinemas"],
            "Fuel": ["Indian Oil", "HP Fuel"],
            "Utilities": ["BSES Bill", "Airtel Postpaid"],
            "Healthcare": ["Apollo Pharmacy", "Netmeds"],
            "Education": ["Udemy", "Coursera"],
            "Miscellaneous": ["Local Store", "Gift Shop"]
        };

        for (let i = 0; i < 100; i++) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const categoryMerchants = merchants[randomCategory];
            const randomMerchant = categoryMerchants[Math.floor(Math.random() * categoryMerchants.length)];
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365)); // Transactions in the last year

            transactions.push({
                id: i + 1,
                date: date.toISOString(),
                merchant: randomMerchant,
                category: randomCategory,
                amount: parseFloat((Math.random() * (5000 - 50) + 50).toFixed(2)), // Amount between 50 and 5000
                cardId: randomCard.id,
                cardName: randomCard.cardName,
                bank: randomCard.bank,
                status: Math.random() > 0.3 ? 'Paid' : 'Pending', // 70% paid, 30% pending
                remarks: "Standard transaction."
            });
        }
        return transactions;
    }

    const transactions = generateTransactions();

    // Service API: exposes data fetching methods
    // Simulates an async API call with a delay for the loader effect
    const service = {
        getCards: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(cards);
            }, 500);
            return deferred.promise;
        },
        getTransactions: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(transactions);
            }, 500);
            return deferred.promise;
        }
    };

    return service;
}]);