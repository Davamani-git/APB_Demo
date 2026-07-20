describe('dataService', function () {
    var dataService;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(inject(function (_dataService_) {
        dataService = _dataService_;
    }));

    describe('getCards', function () {
        it('should return an array of cards (normal case)', function () {
            // Arrange
            // Act
            var cards = dataService.getCards();

            // Assert
            expect(Array.isArray(cards)).toBe(true);
            expect(cards.length).toBeGreaterThan(0);
        });

        it('should return card objects with required properties (structure validation)', function () {
            // Arrange
            // Act
            var cards = dataService.getCards();
            var card = cards[0];

            // Assert
            expect(card.id).toBeDefined();
            expect(card.cardName).toBeDefined();
            expect(card.bank).toBeDefined();
            expect(card.cardNumber).toBeDefined();
            expect(card.creditLimit).toBeDefined();
            expect(card.availableCredit).toBeDefined();
            expect(card.outstanding).toBeDefined();
            expect(card.billingDate).toBeDefined();
            expect(card.dueDate).toBeDefined();
        });

        it('should always return the same cards instance (immutability assumption)', function () {
            // Arrange
            var firstCallCards = dataService.getCards();

            // Act
            var secondCallCards = dataService.getCards();

            // Assert
            expect(secondCallCards).toBe(firstCallCards);
        });
    });

    describe('getTransactions', function () {
        it('should return an array of transactions (normal case)', function () {
            // Arrange
            // Act
            var txs = dataService.getTransactions();

            // Assert
            expect(Array.isArray(txs)).toBe(true);
            expect(txs.length).toBeGreaterThan(0);
        });

        it('should return transactions with required properties (structure validation)', function () {
            // Arrange
            // Act
            var txs = dataService.getTransactions();
            var tx = txs[0];

            // Assert
            expect(tx.id).toBeDefined();
            expect(tx.date).toBeDefined();
            expect(tx.merchant).toBeDefined();
            expect(tx.amount).toBeDefined();
            expect(tx.category).toBeDefined();
            expect(tx.cardId).toBeDefined();
            expect(tx.status).toBeDefined();
            expect(tx.remarks).toBeDefined();
        });

        it('should generate transactions within last 12 months (boundary/logic case)', function () {
            // Arrange
            var now = new Date();
            var twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 365);

            // Act
            var txs = dataService.getTransactions();

            // Assert
            txs.forEach(function (tx) {
                var txDate = new Date(tx.date);
                expect(txDate.getTime()).toBeGreaterThanOrEqual(twelveMonthsAgo.getTime());
                expect(txDate.getTime()).toBeLessThanOrEqual(now.getTime());
            });
        });

        it('should maintain consistent transaction list across calls (state consistency)', function () {
            // Arrange
            var firstCallTxs = dataService.getTransactions();

            // Act
            var secondCallTxs = dataService.getTransactions();

            // Assert
            expect(secondCallTxs).toBe(firstCallTxs);
        });

        it('should provide amounts within the expected range (50 to 5000) (boundary case)', function () {
            // Arrange
            // Act
            var txs = dataService.getTransactions();

            // Assert
            txs.forEach(function (tx) {
                expect(tx.amount).toBeGreaterThanOrEqual(50);
                expect(tx.amount).toBeLessThanOrEqual(5000);
            });
        });
    });
});

/*
Test Documentation:
- Test Name: dataService factory
- Purpose: Validate mock data service for cards and transactions, ensuring structural integrity and basic invariants.
- Scenario: Normal retrieval of cards and transactions, validation of data structure, and boundary checks on dates and amounts.
- Expected Result: Service returns stable arrays of well-formed card and transaction objects that match the design assumptions.
*/

/*
Coverage Report:
- Functions tested:
  - getCards
  - getTransactions
- Statements covered:
  - Factory return object paths for both methods
  - Implicit execution of generateTransactions via factory initialization
- Branches covered:
  - Randomized generation paths are exercised implicitly but not deterministically enumerated
- Error scenarios covered:
  - No explicit error branches exist; tests ensure no exceptions thrown during normal usage
- Uncovered scenarios:
  - Internal random distribution properties within generateTransactions (number of transactions per merchant/category)
  - Behavior when cards array is modified externally (not part of intended usage)
*/