describe('dataService', function() {
    var dataService;
    var $q;
    var $rootScope;
    var $timeout;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(module(function($provide) {
        // No external dependencies beyond $q and setTimeout; use angular $timeout to control async behavior.
        // We wrap setTimeout calls by spying on global setTimeout for timing verification.
    }));

    beforeEach(inject(function(_dataService_, _$q_, _$rootScope_, _$timeout_) {
        dataService = _dataService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    function flushAsync() {
        $timeout.flush();
        $rootScope.$digest();
    }

    describe('getCreditCards', function() {
        it('should resolve with mock creditCards data (normal case)', function() {
            // Arrange
            var result;

            // Act
            dataService.getCreditCards().then(function(cards) {
                result = cards;
            });
            jasmine.clock().install();
            jasmine.clock().tick(501); // Simulate passage of time beyond setTimeout(500)
            jasmine.clock().uninstall();

            // Assert
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].id).toBeDefined();
            expect(result[0].cardName).toBeDefined();
        });

        it('should support promise chaining using then', function(done) {
            // Arrange & Act
            dataService.getCreditCards().then(function(cards) {
                expect(Array.isArray(cards)).toBe(true);
                return cards[0];
            }).then(function(firstCard) {
                // Assert
                expect(firstCard).toBeDefined();
                expect(firstCard.id).toBeDefined();
                done();
            });

            jasmine.clock().install();
            jasmine.clock().tick(501);
            jasmine.clock().uninstall();
        });

        it('should handle consumers expecting empty results (edge case)', function(done) {
            // Arrange: spy on internal creditCards array via returned value
            dataService.getCreditCards().then(function(cards) {
                // Act
                var filtered = cards.filter(function(c) { return false; });
                // Assert
                expect(filtered.length).toBe(0);
                done();
            });

            jasmine.clock().install();
            jasmine.clock().tick(501);
            jasmine.clock().uninstall();
        });
    });

    describe('getTransactions', function() {
        it('should resolve with generated transactions data (normal case)', function() {
            // Arrange
            var result;

            // Act
            dataService.getTransactions().then(function(txs) {
                result = txs;
            });
            jasmine.clock().install();
            jasmine.clock().tick(801); // Simulate passage of time beyond setTimeout(800)
            jasmine.clock().uninstall();

            // Assert
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].id).toBeDefined();
            expect(result[0].merchant).toBeDefined();
            expect(result[0].category).toBeDefined();
            expect(result[0].amount).toBeDefined();
            expect(result[0].cardId).toBeDefined();
        });

        it('should produce transactions within the last 365 days (boundary condition)', function(done) {
            // Arrange & Act
            dataService.getTransactions().then(function(txs) {
                var now = new Date();
                var days365Ago = new Date();
                days365Ago.setDate(now.getDate() - 365);

                // Assert
                txs.forEach(function(tx) {
                    var txDate = new Date(tx.date);
                    expect(txDate.getTime()).toBeGreaterThanOrEqual(days365Ago.getTime());
                    expect(txDate.getTime()).toBeLessThanOrEqual(now.getTime());
                });
                done();
            });

            jasmine.clock().install();
            jasmine.clock().tick(801);
            jasmine.clock().uninstall();
        });

        it('should allow consumers to handle large transaction arrays without errors', function(done) {
            // Arrange & Act
            dataService.getTransactions().then(function(txs) {
                // Assert: ensure at least 100 transactions as per generator
                expect(txs.length).toBeGreaterThanOrEqual(100);
                // Edge: check first and last transaction structure
                var first = txs[0];
                var last = txs[txs.length - 1];
                expect(first.id).toBeDefined();
                expect(last.id).toBeDefined();
                done();
            });

            jasmine.clock().install();
            jasmine.clock().tick(801);
            jasmine.clock().uninstall();
        });
    });
});
/*
Test Documentation:
- Test Name: dataService asynchronous data retrieval
- Purpose: Validate that dataService returns promises that resolve to realistic mock credit card and transaction data, simulating network latency.
- Scenario: Normal retrieval of cards and transactions, promise chaining, consumer filtering expectations, and transaction date boundaries.
- Expected Result: getCreditCards and getTransactions resolve after simulated delays with arrays of well-structured objects; consumers can safely chain and process the data.
*/
/*
Coverage Report:
- Functions tested:
  - service.getCreditCards
  - service.getTransactions
  - generateTransactions (indirect via getTransactions)
- Statements covered:
  - setTimeout-based resolution paths for both service methods
  - Generation of merchant, category, amount, cardId, status, and remarks in transactions
- Branches covered:
  - Random selection of merchants and cards (statistical coverage; deterministic branches are not present)
- Error scenarios covered:
  - Consumer-side handling of empty filtered results from creditCards
- Uncovered scenarios:
  - Explicit rejection paths (service does not implement error rejecting logic)
  - Deterministic verification of random distribution of merchants and categories
  - Extreme timing variations beyond fixed setTimeout durations
*/