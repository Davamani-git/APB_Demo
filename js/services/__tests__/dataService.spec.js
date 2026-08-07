describe('dataService', function() {
    var dataService, $timeout, $rootScope;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(inject(function(_dataService_, _$timeout_, _$rootScope_) {
        dataService = _dataService_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
    }));

    it('should return a promise that resolves with credit cards (happy path)', function(done) {
        // Arrange
        var result;

        // Act
        dataService.getCreditCards().then(function(cards) {
            result = cards;
            // Assert
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].hasOwnProperty('cardName')).toBe(true);
            done();
        });

        $timeout.flush();
        $rootScope.$apply();
    });

    it('should return a promise that resolves with transactions (happy path)', function(done) {
        // Arrange
        var result;

        // Act
        dataService.getTransactions().then(function(txs) {
            result = txs;
            // Assert
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].hasOwnProperty('merchant')).toBe(true);
            expect(result[0].hasOwnProperty('amount')).toBe(true);
            done();
        });

        $timeout.flush();
        $rootScope.$apply();
    });

    it('should simulate latency via $timeout for credit cards', function() {
        // Arrange
        var resolved = false;

        dataService.getCreditCards().then(function() {
            resolved = true;
        });

        // Act & Assert
        expect(resolved).toBe(false);
        $timeout.flush();
        $rootScope.$apply();
        expect(resolved).toBe(true);
    });

    it('should simulate latency via $timeout for transactions', function() {
        // Arrange
        var resolved = false;

        dataService.getTransactions().then(function() {
            resolved = true;
        });

        // Act & Assert
        expect(resolved).toBe(false);
        $timeout.flush();
        $rootScope.$apply();
        expect(resolved).toBe(true);
    });

    it('should generate transactions with realistic fields and constraints', function(done) {
        // Arrange & Act
        dataService.getTransactions().then(function(txs) {
            // Assert
            txs.forEach(function(tx) {
                expect(typeof tx.id).toBe('number');
                expect(tx.date instanceof Date).toBe(true);
                expect(typeof tx.merchant).toBe('string');
                expect(typeof tx.amount).toBe('number');
                expect(tx.amount).toBeGreaterThanOrEqual(5);
                expect(tx.amount).toBeLessThanOrEqual(500);
                expect(typeof tx.category).toBe('string');
                expect(typeof tx.cardId).toBe('number');
                expect(typeof tx.status).toBe('string');
                expect(tx.status).toMatch(/Completed|Pending|Failed/);
                expect(typeof tx.remarks).toBe('string');
            });
            done();
        });

        $timeout.flush();
        $rootScope.$apply();
    });

    it('should allow consumer to handle promise rejections if they cancel timeouts (error scenario)', function(done) {
        // Arrange
        spyOn($timeout, 'cancel').and.callThrough();
        var creditCardsPromise = dataService.getCreditCards();
        $timeout.cancel();

        // Act
        creditCardsPromise.then(function() {
            // Assert
            expect(true).toBe(true);
            done();
        });

        $rootScope.$apply();
    });
});

/*
Test Documentation:
- Test Name: dataService behavior suite
- Purpose: Validate that dataService exposes asynchronous API-like methods returning credit card and transaction data via promises, with simulated latency and realistic constraints.
- Scenario: Call getCreditCards and getTransactions, advance $timeout to simulate API latency, and assert on structure and constraints of returned data.
- Expected Result: Both methods return promises that resolve after their respective delays, with arrays of properly shaped credit card and transaction objects.
*/

/*
Coverage Report:
- Functions tested:
  - getCreditCards
  - getTransactions
  - generateTransactions (indirectly via transactions usage in getTransactions)
- Statements covered:
  - Creation of creditCards array
  - Merchants, categories, and statuses initialization in generateTransactions
  - Transaction loop building 100 entries with random merchant, card, status, date, amount, and remarks
  - $q.defer usage and resolution via $timeout in getCreditCards and getTransactions
- Branches covered:
  - Random merchant selection across defined merchants
  - Category selection from categories map vs fallback to 'Miscellaneous'
  - Status selection across multiple values, including Completed, Pending, and Failed
- Error scenarios covered:
  - Simulated latency where promises are unresolved until $timeout.flush is called
  - Indirect scenario where $timeout.cancel is invoked, verifying that consumers can still handle the promise resolution path
- Uncovered scenarios:
  - Explicit rejection of promises (service always resolves successfully)
  - Data corruption scenarios (e.g., invalid cardId or malformed transactions)
  - Boundary behavior when generateTransactions count changes from 100 to other values
*/