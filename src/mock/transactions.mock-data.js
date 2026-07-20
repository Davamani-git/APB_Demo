window.TransactionsMockData = (function() {
    'use strict';

    var allTransactions = [
        { id: 'txn-1', transactionDate: '2026-07-28', merchantName: 'Office Supplies Inc.', category: 'Shopping', cardId: 'card-1', cardName: 'Enterprise Platinum', issuingBank: 'Global Bank', amount: 150.00, paymentStatus: 'PAID', remarks: '' },
        { id: 'txn-2', transactionDate: '2026-07-27', merchantName: 'The Grand Restaurant', category: 'Food & Dining', cardId: 'card-2', cardName: 'Business Gold', issuingBank: 'Commerce Trust', amount: 275.50, paymentStatus: 'PAID', remarks: 'Client Dinner' },
        { id: 'txn-3', transactionDate: '2026-07-27', merchantName: 'City Gas Station', category: 'Fuel', cardId: 'card-1', cardName: 'Enterprise Platinum', issuingBank: 'Global Bank', amount: 80.25, paymentStatus: 'PAID', remarks: '' },
        { id: 'txn-4', transactionDate: '2026-07-26', merchantName: 'Cloud Services Corp', category: 'Utilities', cardId: 'card-2', cardName: 'Business Gold', issuingBank: 'Commerce Trust', amount: 500.00, paymentStatus: 'PAID', remarks: 'Monthly Subscription' },
        { id: 'txn-5', transactionDate: '2026-07-25', merchantName: 'Airline Express', category: 'Travel', cardId: 'card-1', cardName: 'Enterprise Platinum', issuingBank: 'Global Bank', amount: 1250.00, paymentStatus: 'PENDING', remarks: 'Flight to NYC' },
        { id: 'txn-6', transactionDate: '2026-07-24', merchantName: 'Coffee Corner', category: 'Food & Dining', cardId: 'card-2', cardName: 'Business Gold', issuingBank: 'Commerce Trust', amount: 12.75, paymentStatus: 'PAID', remarks: '' },
        { id: 'txn-7', transactionDate: '2026-07-22', merchantName: 'Tech Gadgets', category: 'Shopping', cardId: 'card-1', cardName: 'Enterprise Platinum', issuingBank: 'Global Bank', amount: 899.99, paymentStatus: 'PAID', remarks: 'New Monitor' },
        { id: 'txn-8', transactionDate: '2026-07-20', merchantName: 'Highway Tolls', category: 'Travel', cardId: 'card-2', cardName: 'Business Gold', issuingBank: 'Commerce Trust', amount: 25.00, paymentStatus: 'PAID', remarks: '' },
        { id: 'txn-9', transactionDate: '2026-06-15', merchantName: 'Luxury Hotel', category: 'Travel', cardId: 'card-1', cardName: 'Enterprise Platinum', issuingBank: 'Global Bank', amount: 2200.00, paymentStatus: 'PAID', remarks: 'Conference Stay' },
        { id: 'txn-10', transactionDate: '2026-06-10', merchantName: 'Software Solutions', category: 'Utilities', cardId: 'card-2', cardName: 'Business Gold', issuingBank: 'Commerce Trust', amount: 1200.00, paymentStatus: 'PAID', remarks: 'Annual License' }
    ];

    // Add more data for pagination
    for (var i = 11; i <= 50; i++) {
        allTransactions.push({
            id: 'txn-' + i,
            transactionDate: '2026-07-' + (28 - (i % 28)),
            merchantName: 'Merchant ' + i,
            category: ['Shopping', 'Food & Dining', 'Utilities', 'Travel'][i % 4],
            cardId: ['card-1', 'card-2'][i % 2],
            cardName: ['Enterprise Platinum', 'Business Gold'][i % 2],
            issuingBank: ['Global Bank', 'Commerce Trust'][i % 2],
            amount: Math.random() * 500,
            paymentStatus: 'PAID',
            remarks: ''
        });
    }

    function search(filters) {
        var filtered = allTransactions.filter(function(tx) {
            var match = true;
            if (filters.merchant && !tx.merchantName.toLowerCase().includes(filters.merchant.toLowerCase())) match = false;
            if (filters.category && tx.category !== filters.category) match = false;
            if (filters.bank && tx.issuingBank !== filters.bank) match = false;
            if (filters.cardId && tx.cardId !== filters.cardId) match = false;
            if (filters.dateFrom && new Date(tx.transactionDate) < new Date(filters.dateFrom)) match = false;
            if (filters.dateTo && new Date(tx.transactionDate) > new Date(filters.dateTo)) match = false;
            return match;
        });

        filtered.sort(function(a, b) {
            var fieldA = a[filters.sortBy];
            var fieldB = b[filters.sortBy];
            var comparison = 0;
            if (fieldA > fieldB) comparison = 1;
            if (fieldA < fieldB) comparison = -1;
            return filters.sortDirection === 'desc' ? comparison * -1 : comparison;
        });

        var start = (filters.page - 1) * filters.pageSize;
        var end = start + filters.pageSize;
        var paginated = filtered.slice(start, end);

        return {
            items: paginated,
            totalCount: filtered.length
        };
    }

    function getRecent(limit) {
        return allTransactions.slice(0, limit);
    }

    return {
        search: search,
        getRecent: getRecent
    };
})();