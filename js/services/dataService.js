angular.module('creditCardDashboardApp').factory('dataService', function() {
    // Mock data for credit cards
    const creditCards = [
        {
            "id": 1,
            "cardName": "HDFC Regalia",
            "bank": "HDFC Bank",
            "cardNumber": "XXXX-XXXX-XXXX-4567",
            "creditLimit": 500000,
            "availableCredit": 320000,
            "outstanding": 180000,
            "billingDate": "5",
            "dueDate": "25"
        },
        {
            "id": 2,
            "cardName": "SBI Prime",
            "bank": "SBI",
            "cardNumber": "XXXX-XXXX-XXXX-6789",
            "creditLimit": 300000,
            "availableCredit": 180000,
            "outstanding": 120000,
            "billingDate": "10",
            "dueDate": "30"
        },
        {
            "id": 3,
            "cardName": "ICICI Coral",
            "bank": "ICICI",
            "cardNumber": "XXXX-XXXX-XXXX-9876",
            "creditLimit": 200000,
            "availableCredit": 130000,
            "outstanding": 70000,
            "billingDate": "12",
            "dueDate": "2"
        }
    ];

    // Function to generate mock transactions
    function generateTransactions() {
        const merchants = ["Amazon", "Flipkart", "Swiggy", "Zomato", "Uber", "Ola", "Reliance Digital", "BigBasket", "BookMyShow", "MakeMyTrip", "Apollo Pharmacy", "Croma"];
        const categories = {
            "Amazon": "Shopping", "Flipkart": "Shopping", "Swiggy": "Food & Dining", "Zomato": "Food & Dining",
            "Uber": "Travel", "Ola": "Travel", "Reliance Digital": "Shopping", "BigBasket": "Utilities",
            "BookMyShow": "Entertainment", "MakeMyTrip": "Travel", "Apollo Pharmacy": "Healthcare", "Croma": "Shopping"
        };
        const transactions = [];
        for (let i = 0; i < 100; i++) {
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            const card = creditCards[Math.floor(Math.random() * creditCards.length)];
            const date = new Date(new Date().getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
            transactions.push({
                id: i + 1,
                date: date.toISOString().split('T')[0],
                merchant: merchant,
                category: categories[merchant],
                cardUsed: card.cardName,
                amount: Math.floor(Math.random() * 5000) + 100,
                paymentStatus: Math.random() > 0.5 ? 'Paid' : 'Pending',
                remarks: 'Lorem ipsum dolor sit amet.'
            });
        }
        return transactions;
    }

    const transactions = generateTransactions();

    return {
        getCreditCards: function() {
            return creditCards;
        },
        getTransactions: function() {
            return transactions;
        }
    };
});
