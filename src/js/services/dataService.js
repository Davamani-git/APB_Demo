/**
 * Data Service
 * Provides mock data for the application.
 */
app.factory('dataService', function () {

    // Mock credit card data
    const cards = [
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

    // Function to generate mock transactions
    function generateTransactions() {
        const transactions = [];
        const merchants = ["Amazon", "Flipkart", "Swiggy", "Zomato", "Uber", "Ola", "Reliance Digital", "BigBasket", "BookMyShow", "MakeMyTrip", "Apollo Pharmacy", "Croma"];
        const categories = {
            "Amazon": "Shopping", "Flipkart": "Shopping", "Croma": "Shopping", "Reliance Digital": "Shopping",
            "Swiggy": "Food & Dining", "Zomato": "Food & Dining", "BigBasket": "Food & Dining",
            "Uber": "Travel", "Ola": "Travel", "MakeMyTrip": "Travel",
            "BookMyShow": "Entertainment",
            "Apollo Pharmacy": "Healthcare",
        };
        const statuses = ["Settled", "Pending"];

        for (let i = 0; i < 100; i++) {
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            const category = categories[merchant] || "Miscellaneous";
            const card = cards[Math.floor(Math.random() * cards.length)];
            
            // Generate a date within the last 12 months
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));

            transactions.push({
                id: `TXN${1000 + i}`,
                date: date.toISOString(),
                merchant: merchant,
                amount: parseFloat((Math.random() * (5000 - 50) + 50).toFixed(2)),
                category: category,
                cardId: card.id,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                remarks: "Online Payment"
            });
        }
        return transactions;
    }

    const transactions = generateTransactions();

    // Service public API
    return {
        getCards: function () {
            return cards;
        },
        getTransactions: function () {
            return transactions;
        }
    };
});
