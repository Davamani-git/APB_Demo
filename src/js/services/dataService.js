/**
 * dataService.js
 *
 * This service is responsible for providing mock data for the application.
 * It simulates a backend data source by returning hardcoded JSON data.
 * In a real-world application, this service would be modified to make
 * HTTP requests to a REST API.
 */
app.service('dataService', function() {

    // --- Mock Credit Card Data ---
    const creditCards = [
        {
            "id": 1,
            "cardName": "Platinum Rewards",
            "bank": "Europe Bank",
            "cardNumber": "XXXX-XXXX-XXXX-4567",
            "creditLimit": 50000,
            "availableCredit": 32000,
            "outstanding": 18000,
            "billingDate": "2024-07-05",
            "dueDate": "2024-07-25"
        },
        {
            "id": 2,
            "cardName": "Gold Cashback",
            "bank": "Europe Bank",
            "cardNumber": "XXXX-XXXX-XXXX-6789",
            "creditLimit": 30000,
            "availableCredit": 18000,
            "outstanding": 12000,
            "billingDate": "2024-07-10",
            "dueDate": "2024-07-30"
        },
        {
            "id": 3,
            "cardName": "Travel Miles",
            "bank": "Europe Bank",
            "cardNumber": "XXXX-XXXX-XXXX-9876",
            "creditLimit": 20000,
            "availableCredit": 13000,
            "outstanding": 7000,
            "billingDate": "2024-07-12",
            "dueDate": "2024-08-02"
        }
    ];

    // --- Mock Transaction Data Generation ---
    const transactions = generateMockTransactions(100);

    function generateMockTransactions(count) {
        const merchants = [
            { name: 'Amazon Spain', category: 'Shopping' },
            { name: 'PcComponentes', category: 'Shopping' },
            { name: 'Glovo', category: 'Food & Dining' },
            { name: 'Just Eat Spain', category: 'Food & Dining' },
            { name: 'Uber', category: 'Travel' },
            { name: 'Cabify', category: 'Travel' },
            { name: 'MediaMarkt Digital', category: 'Shopping' },
            { name: 'Mercadona Online', category: 'Food & Dining' },
            { name: 'Entradas', category: 'Entertainment' },
            { name: 'eDreams', category: 'Travel' },
            { name: 'PromoFarma', category: 'Healthcare' },
            { name: 'Worten', category: 'Shopping' },
            { name: 'Repsol Fuel', category: 'Fuel' },
            { name: 'Iberdrola', category: 'Utilities' },
            { name: 'Coursera', category: 'Education' },
            { name: 'Local Cafe', category: 'Food & Dining' },
            { name: 'Zara', category: 'Shopping' },
            { name: 'Netflix', category: 'Entertainment' },
            { name: 'Miscellaneous Goods', category: 'Miscellaneous' }
        ];

        const generatedTransactions = [];
        const today = new Date();

        for (let i = 0; i < count; i++) {
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            const daysAgo = Math.floor(Math.random() * 365); // Transactions in the last year
            const transactionDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);

            let amount;
            switch (merchant.category) {
                case 'Travel':
                case 'Shopping':
                    amount = parseFloat((Math.random() * 400 + 50).toFixed(2)); // 50 - 450
                    break;
                case 'Healthcare':
                case 'Utilities':
                    amount = parseFloat((Math.random() * 150 + 20).toFixed(2)); // 20 - 170
                    break;
                case 'Food & Dining':
                    amount = parseFloat((Math.random() * 80 + 5).toFixed(2)); // 5 - 85
                    break;
                default:
                    amount = parseFloat((Math.random() * 100 + 10).toFixed(2)); // 10 - 110
            }

            generatedTransactions.push({
                id: 1000 + i,
                date: transactionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                merchant: merchant.name,
                amount: amount,
                category: merchant.category,
                cardId: Math.floor(Math.random() * 3) + 1, // Assign to one of the 3 cards
                status: Math.random() > 0.1 ? 'Completed' : 'Pending', // 90% chance of being completed
                remarks: 'Online Purchase'
            });
        }
        return generatedTransactions;
    }


    // --- Public API of the Service ---
    return {
        /**
         * @returns {Array} A list of all credit card objects.
         */
        getCreditCards: function() {
            return creditCards;
        },

        /**
         * @returns {Array} A list of all transaction objects.
         */
        getTransactions: function() {
            return transactions;
        }
    };
});
