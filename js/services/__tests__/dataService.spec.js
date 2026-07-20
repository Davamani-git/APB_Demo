describe('dataService', function() {
    var dataService;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(inject(function(_dataService_) {
        dataService = _dataService_;
    }));

    describe('getCards', function() {
        it('should return a non-empty array of cards', function() {
            // Arrange & Act
            var cards = dataService.getCards();

            // Assert
            expect(Array.isArray(cards)).toBe(true);
            expect(cards.length).toBeGreaterThan(0);
        });
    });

    describe('getTransactions', function() {
        it('should return a non-empty array of transactions', function() {
            // Arrange & Act
            var transactions = dataService.getTransactions();

            // Assert
            expect(Array.isArray(transactions)).toBe(true);
            expect(transactions.length).toBeGreaterThan(0);
        });

        it('should contain transaction objects with required properties', function() {
            // Arrange
            var transactions = dataService.getTransactions();

            // Act
            var tx = transactions[0];

            // Assert
            expect(tx.id).toBeDefined();
            expect(tx.date instanceof Date).toBe(true);
            expect(typeof tx.merchant).toBe('string');
            expect(typeof tx.category).toBe('string');
            expect(typeof tx.amount).toBe('number');
            expect(typeof tx.cardId).toBe('number');
        });
    });

    describe('getFilteredTransactions', function() {
        var baseTransactions;

        beforeEach(function() {
            baseTransactions = dataService.getTransactions();
        });

        it('should filter by merchant substring case-insensitively', function() {
            // Arrange
            var filters = { merchant: 'amazon', category: '', cardId: '', startDate: null, endDate: null };

            // Act
            var filtered = dataService.getFilteredTransactions(filters);

            // Assert
            filtered.forEach(function(tx) {
                expect(tx.merchant.toLowerCase()).toContain('amazon');
            });
        });

        it('should filter by exact category match', function() {
            // Arrange
            var sample = baseTransactions[0];
            var filters = { merchant: '', category: sample.category, cardId: '', startDate: null, endDate: null };

            // Act
            var filtered = dataService.getFilteredTransactions(filters);

            // Assert
            filtered.forEach(function(tx) {
                expect(tx.category).toBe(sample.category);
            });
        });

        it('should filter by cardId', function() {
            // Arrange
            var filters = { merchant: '', category: '', cardId: 1, startDate: null, endDate: null };

            // Act
            var filtered = dataService.getFilteredTransactions(filters);

            // Assert
            filtered.forEach(function(tx) {
                expect(tx.cardId).toBe(1);
            });
        });

        it('should filter by startDate inclusive', function() {
            // Arrange
            var all = baseTransactions.slice();
            var startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            var filters = { merchant: '', category: '', cardId: '', startDate: startDate, endDate: null };

            // Act
            var filtered = dataService.getFilteredTransactions(filters);

            // Assert
            filtered.forEach(function(tx) {
                expect(tx.date >= startDate).toBe(true);
            });
        });

        it('should filter by endDate inclusive of the full day', function() {
            // Arrange
            var endDate = new Date();
            var filters = { merchant: '', category: '', cardId: '', startDate: null, endDate: endDate };

            // Act
            var filtered = dataService.getFilteredTransactions(filters);

            // Assert
            filtered.forEach(function(tx) {
                expect(tx.date <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)).toBe(true);
            });
        });

        it('should return all transactions when filters are empty or null', function() {
            // Arrange
            var filters = { merchant: '', category: '', cardId: '', startDate: null, endDate: null };

            // Act
            var filtered = dataService.getFilteredTransactions(filters);

            // Assert
            expect(filtered.length).toBe(baseTransactions.length);
        });
    });

    describe('getDashboardSummary', function() {
        it('should compute total limits, outstanding, and available', function() {
            // Arrange
            var cards = [
                { creditLimit: 1000, outstanding: 200, availableCredit: 800 },
                { creditLimit: 2000, outstanding: 500, availableCredit: 1500 }
            ];
            var transactions = [];

            // Act
            var summary = dataService.getDashboardSummary(cards, transactions);

            // Assert
            expect(summary.totalLimit).toBe(3000);
            expect(summary.totalOutstanding).toBe(700);
            expect(summary.totalAvailable).toBe(2300);
        });

        it('should compute monthlySpend based on current month transactions', function() {
            // Arrange
            var today = new Date();
            var sameMonthTx = { date: new Date(today.getFullYear(), today.getMonth(), 1), amount: 100 };
            var otherMonthTx = { date: new Date(today.getFullYear(), today.getMonth() - 1, 1), amount: 200 };
            var cards = [];
            var filteredTransactions = [sameMonthTx, otherMonthTx];

            // Act
            var summary = dataService.getDashboardSummary(cards, filteredTransactions);

            // Assert
            expect(summary.monthlySpend).toBe(100);
        });

        it('should compute utilization as percentage of totalOutstanding over totalLimit when totalLimit > 0', function() {
            // Arrange
            var cards = [
                { creditLimit: 1000, outstanding: 200, availableCredit: 800 },
                { creditLimit: 1000, outstanding: 300, availableCredit: 700 }
            ];
            var transactions = [];

            // Act
            var summary = dataService.getDashboardSummary(cards, transactions);

            // Assert
            expect(summary.utilization).toBeCloseTo((500 / 2000) * 100, 5);
        });

        it('should leave utilization as 0 when totalLimit is 0', function() {
            // Arrange
            var cards = [
                { creditLimit: 0, outstanding: 0, availableCredit: 0 }
            ];
            var transactions = [];

            // Act
            var summary = dataService.getDashboardSummary(cards, transactions);

            // Assert
            expect(summary.utilization).toBe(0);
        });
    });

    describe('getCategorySpending', function() {
        it('should aggregate amounts by category', function() {
            // Arrange
            var transactions = [
                { category: 'Shopping', amount: 100 },
                { category: 'Shopping', amount: 50 },
                { category: 'Travel', amount: 200 }
            ];

            // Act
            var result = dataService.getCategorySpending(transactions);

            // Assert
            var indexShopping = result.labels.indexOf('Shopping');
            var indexTravel = result.labels.indexOf('Travel');
            expect(result.data[indexShopping]).toBe(150);
            expect(result.data[indexTravel]).toBe(200);
        });

        it('should return empty labels and data when transactions are empty', function() {
            // Arrange
            var transactions = [];

            // Act
            var result = dataService.getCategorySpending(transactions);

            // Assert
            expect(result.labels.length).toBe(0);
            expect(result.data.length).toBe(0);
        });
    });

    describe('getMonthlySpendingTrend', function() {
        it('should create 12 months of labels and aggregate spending to the correct month', function() {
            // Arrange
            var transactions = [];
            var today = new Date();
            var sampleMonthTx = {
                date: new Date(today.getFullYear(), today.getMonth(), 10),
                amount: 500
            };
            transactions.push(sampleMonthTx);

            // Act
            var result = dataService.getMonthlySpendingTrend(transactions);

            // Assert
            expect(result.labels.length).toBe(12);
            expect(result.data.length).toBe(12);
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var expectedKey = monthNames[today.getMonth()] + " '" + today.getFullYear().toString().substr(-2);
            var index = result.labels.indexOf(expectedKey);
            expect(result.data[index]).toBeGreaterThanOrEqual(500);
        });

        it('should return all zero data when there are no transactions', function() {
            // Arrange
            var transactions = [];

            // Act
            var result = dataService.getMonthlySpendingTrend(transactions);

            // Assert
            result.data.forEach(function(value) {
                expect(value).toBe(0);
            });
        });
    });

    describe('getMonthlySpendForecast', function() {
        it('should return 0 when there are no transactions in the current month', function() {
            // Arrange
            var today = new Date();
            var txOtherMonth = {
                date: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                amount: 100
            };

            var result = dataService.getMonthlySpendForecast([txOtherMonth]);

            // Assert
            expect(result).toBe(0);
        });

        it('should compute forecast based on daily average when there are current month transactions', function() {
            // Arrange
            var today = new Date();
            var currentDay = today.getDate();
            var daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            var txCurrentMonth = {
                date: new Date(today.getFullYear(), today.getMonth(), 1),
                amount: 300
            };

            // Act
            var forecast = dataService.getMonthlySpendForecast([txCurrentMonth]);

            // Assert
            var expectedDailyAverage = 300 / currentDay;
            var expectedForecast = expectedDailyAverage * daysInMonth;
            expect(forecast).toBeCloseTo(expectedForecast, 5);
        });

        it('should return 0 when currentDay or currentMonthSpend is 0 (edge case)', function() {
            // Arrange
            var result = dataService.getMonthlySpendForecast([]);

            // Assert
            expect(result).toBe(0);
        });
    });

    describe('getTopSpendingGroups', function() {
        it('should aggregate and sort groups by amount descending and return top N categories', function() {
            // Arrange
            var transactions = [
                { category: 'Shopping', amount: 100 },
                { category: 'Travel', amount: 200 },
                { category: 'Shopping', amount: 300 },
                { category: 'Food', amount: 50 }
            ];

            // Act
            var result = dataService.getTopSpendingGroups(transactions, 'category', 2);

            // Assert
            expect(result.length).toBe(2);
            expect(result[0].category).toBe('Shopping');
            expect(result[1].category).toBe('Travel');
        });

        it('should handle groupBy merchant similarly', function() {
            // Arrange
            var transactions = [
                { merchant: 'Amazon', amount: 100 },
                { merchant: 'Flipkart', amount: 200 },
                { merchant: 'Amazon', amount: 300 }
            ];

            // Act
            var result = dataService.getTopSpendingGroups(transactions, 'merchant', 1);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].merchant).toBe('Amazon');
            expect(result[0].amount).toBe(400);
        });

        it('should return empty array when count is 0 or transactions are empty', function() {
            // Arrange
            var transactions = [];

            // Act
            var result = dataService.getTopSpendingGroups(transactions, 'category', 3);
            var resultZeroCount = dataService.getTopSpendingGroups(transactions, 'category', 0);

            // Assert
            expect(result.length).toBe(0);
            expect(resultZeroCount.length).toBe(0);
        });
    });

    describe('getUniqueCategories', function() {
        it('should return a sorted list of unique category names', function() {
            // Arrange
            var categories = dataService.getUniqueCategories();

            // Act & Assert
            expect(Array.isArray(categories)).toBe(true);
            if (categories.length > 1) {
                expect(categories.slice().sort()).toEqual(categories);
            }
        });
    });

});
/*
Test Documentation:
- Test Name: dataService
- Purpose: Validate the mock backend service functions for cards, transactions, filtering, aggregation, trends, forecasts, and grouping logic.
- Scenario: Normal usage with generated mock data, edge conditions such as empty inputs and zero limits, and temporal calculations based on current month and date.
- Expected Result: All service methods return correctly shaped data, perform aggregations accurately, and handle edge cases such as empty transactions and zero totals without throwing errors.
*/
/*
Coverage Report:
- Functions tested:
  - getCards
  - getTransactions
  - getFilteredTransactions
  - getDashboardSummary
  - getCategorySpending
  - getMonthlySpendingTrend
  - getMonthlySpendForecast
  - getTopSpendingGroups
  - getUniqueCategories
- Statements covered:
  - Card and transaction retrieval
  - Filter conditions on merchant, category, cardId, startDate, and inclusive endDate
  - Summary calculations (limits, outstanding, available, monthly spend, utilization)
  - Category aggregation and monthly trend initialization and accumulation
  - Forecast calculation using daily average and days in month
  - Group aggregation, sort, and slice operations
  - Unique category extraction and sorting
- Branches covered:
  - Each filter condition independently (merchant/category/cardId/startDate/endDate)
  - Utilization calculation when totalLimit > 0 vs equals 0
  - Monthly spend forecast when there are current month transactions vs none
  - getTopSpendingGroups with non-empty vs empty transactions and varying count
- Error scenarios covered:
  - Handling empty arrays in aggregation functions without throwing
  - Handling zero totals and ensuring utilization and forecast remain defined
- Uncovered scenarios:
  - Deterministic validation of generateMockTransactions random distribution
  - Extreme date ranges beyond one year (service currently designed for last 12 months)
  - Behavior when transactions contain unexpected or malformed fields (outside mock generator contract)
*/