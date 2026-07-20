/**
 * Data Service (dataService)
 * Handles all mock data operations for the application.
 * In a real-world scenario, this service would make HTTP calls to a secure backend API.
 * PCI-DSS Compliance Note: Sensitive data like full card numbers (PAN), CVV, or expiry dates
 * are NEVER stored or transmitted to the client-side. The masked card number is a representation
 * of this security best practice.
 */
angular.module('creditCardDashboardApp').factory('dataService', ['$q', '$timeout', function ($q, $timeout) {

    // --- MOCK DATA DEFINITIONS ---

    // Mock Credit Card Data
    const mockCards = [
        {
            "id": 1,
            "cardName": "Platinum Rewards Card",
            "bank": "Europe Bank",
            "cardNumber": "XXXX-XXXX-XXXX-4567",
            "creditLimit": 500000,
            "availableCredit": 320000,
            "outstanding": 180000,
            "billingDate": "2024-07-05",
            "dueDate": "2024-07-25"
        },
        {
            "id": 2,
            "cardName": "Traveler's Choice Card",
            "bank": "Global Finance",
            "cardNumber": "XXXX-XXXX-XXXX-6789",
            "creditLimit": 300000,
            "availableCredit": 180000,
            "outstanding": 120000,
            "billingDate": "2024-07-10",
            "dueDate": "2024-07-30"
        },
        {
            "id": 3,
            "cardName": "ShopMore Cashback Card",
            "bank": "Retail Bank Inc.",
            "cardNumber": "XXXX-XXXX-XXXX-9876",
            "creditLimit": 200000,
            "availableCredit": 130000,
            "outstanding": 70000,
            "billingDate": "2024-07-12",
            "dueDate": "2024-08-02"
        }
    ];

    // Helper function to generate mock transactions
    function generateMockTransactions() {
        const transactions = [];
        const merchants = ['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Uber', 'Ola', 'Reliance Digital', 'BigBasket', 'BookMyShow', 'MakeMyTrip', 'Apollo Pharmacy', 'Croma', 'Local Grocer', 'Electricity Bill', 'Phone Recharge'];
        const categoryMap = {
            'Amazon': 'Shopping', 'Flipkart': 'Shopping', 'Reliance Digital': 'Shopping', 'Croma': 'Shopping',
            'Swiggy': 'Food & Dining', 'Zomato': 'Food & Dining', 'BigBasket': 'Food & Dining', 'Local Grocer': 'Food & Dining',
            'Uber': 'Travel', 'Ola': 'Travel', 'MakeMyTrip': 'Travel',
            'BookMyShow': 'Entertainment',
            'Apollo Pharmacy': 'Healthcare',
            'Electricity Bill': 'Utilities', 'Phone Recharge': 'Utilities'
        };

        for (let i = 1; i <= 100; i++) {
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            const category = categoryMap[merchant] || 'Miscellaneous';
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365)); // Transactions within the last year

            transactions.push({
                id: 1000 + i,
                cardId: (i % 3) + 1, // Distribute transactions among 3 cards
                date: date.toISOString(),
                merchant: merchant,
                category: category,
                amount: parseFloat((Math.random() * (8000 - 50) + 50).toFixed(2)), // Amount between 50 and 8000
                status: Math.random() > 0.1 ? 'Completed' : 'Pending', // 90% completed
                remarks: `Purchase on ${merchant}`
            });
        }
        return transactions;
    }

    const mockTransactions = generateMockTransactions();

    // --- SERVICE API METHODS ---

    // Simulates an API call to fetch credit cards
    function getCards() {
        var deferred = $q.defer();
        // Simulate network latency
        $timeout(function () {
            deferred.resolve(angular.copy(mockCards));
        }, 500);
        return deferred.promise;
    }

    // Simulates an API call to fetch transactions
    function getTransactions() {
        var deferred = $q.defer();
        // Simulate network latency
        $timeout(function () {
            deferred.resolve(angular.copy(mockTransactions));
        }, 800);
        return deferred.promise;
    }

    // Public API of the service
    return {
        getCards: getCards,
        getTransactions: getTransactions
    };
}]);
