/**
 * Data Service
 * This service is responsible for providing all the mock data for the application.
 * It simulates an API by returning data asynchronously using $q and $timeout.
 */
angular.module('creditCardDashboardApp').factory('dataService', ['$q', '$timeout', function($q, $timeout) {

    // Mock data for credit cards
    const cards = [
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

    // --- Realistic Transaction Generation ---
    const merchants = [
        { name: 'Amazon Spain', category: 'Shopping' },
        { name: 'PcComponentes', category: 'Shopping' },
        { name: 'Glovo', category: 'Food' },
        { name: 'Just Eat Spain', category: 'Food' },
        { name: 'Uber', category: 'Transport' },
        { name: 'Cabify', category: 'Transport' },
        { name: 'MediaMarkt Digital', category: 'Shopping' },
        { name: 'Mercadona Online', category: 'Groceries' },
        { name: 'Entradas', category: 'Entertainment' },
        { name: 'eDreams', category: 'Travel' },
        { name: 'PromoFarma', category: 'Health' },
        { name: 'Worten', category: 'Shopping' }
    ];

    let transactions = [];
    let transactionId = 1;

    for (let i = 0; i < 100; i++) {
        const today = new Date();
        const pastDate = new Date(today.setMonth(today.getMonth() - Math.floor(Math.random() * 12)));
        pastDate.setDate(Math.floor(Math.random() * 28) + 1);

        const merchantInfo = merchants[Math.floor(Math.random() * merchants.length)];
        const amount = parseFloat((Math.random() * (250 - 5) + 5).toFixed(2));
        const cardId = Math.floor(Math.random() * cards.length) + 1;

        transactions.push({
            id: transactionId++,
            cardId: cardId,
            date: pastDate.toISOString(),
            merchant: merchantInfo.name,
            category: merchantInfo.category,
            amount: amount,
            description: `Purchase at ${merchantInfo.name}`
        });
    }
    // --- End Transaction Generation ---

    // Public API of the service
    const service = {
        getCards: function() {
            const deferred = $q.defer();
            // Simulate 500ms API delay
            $timeout(function() {
                deferred.resolve(cards);
            }, 500);
            return deferred.promise;
        },
        getTransactions: function() {
            const deferred = $q.defer();
            // Simulate 800ms API delay
            $timeout(function() {
                deferred.resolve(transactions);
            }, 800);
            return deferred.promise;
        }
    };

    return service;
}]);
