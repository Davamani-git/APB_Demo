window.DashboardMockData = (function() {
    'use strict';

    var summary = {
        totalMonthlySpend: 24500.75,
        totalCreditLimit: 150000,
        availableCredit: 125499.25,
        outstandingAmount: 24500.75,
        utilizationPercentage: 16.33,
        transactionCount: 132
    };

    var cards = [
        {
            id: 'card-1',
            cardName: 'Enterprise Platinum',
            issuingBank: 'Global Bank',
            maskedCardNumber: '**** **** **** 1234',
            creditLimit: 100000,
            availableCredit: 85000,
            currentOutstanding: 15000,
            billingDate: '2026-08-15',
            dueDate: '2026-09-05'
        },
        {
            id: 'card-2',
            cardName: 'Business Gold',
            issuingBank: 'Commerce Trust',
            maskedCardNumber: '**** **** **** 5678',
            creditLimit: 50000,
            availableCredit: 40499.25,
            currentOutstanding: 9500.75,
            billingDate: '2026-08-20',
            dueDate: '2026-09-10'
        }
    ];

    var budget = {
        monthlyBudget: 50000,
        currentSpend: 24500.75,
        remainingBudget: 25499.25,
        utilizationPercentage: 49.00
    };

    var recentTransactions = [
        { id: 'txn-1', transactionDate: '2026-07-28', merchantName: 'Office Supplies Inc.', category: 'Shopping', cardId: 'card-1', amount: 150.00, paymentStatus: 'PAID' },
        { id: 'txn-2', transactionDate: '2026-07-27', merchantName: 'The Grand Restaurant', category: 'Food & Dining', cardId: 'card-2', amount: 275.50, paymentStatus: 'PAID' },
        { id: 'txn-3', transactionDate: '2026-07-27', merchantName: 'City Gas Station', category: 'Fuel', cardId: 'card-1', amount: 80.25, paymentStatus: 'PAID' },
        { id: 'txn-4', transactionDate: '2026-07-26', merchantName: 'Cloud Services Corp', category: 'Utilities', cardId: 'card-2', amount: 500.00, paymentStatus: 'PAID' },
        { id: 'txn-5', transactionDate: '2026-07-25', merchantName: 'Airline Express', category: 'Travel', cardId: 'card-1', amount: 1250.00, paymentStatus: 'PENDING' }
    ];

    function getSummary() {
        return {
            summary: summary,
            cards: cards,
            budget: budget,
            recentTransactions: recentTransactions
        };
    }

    return {
        getSummary: getSummary
    };
})();