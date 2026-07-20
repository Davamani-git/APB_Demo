describe('dataService', function() {
    var dataService;
    var $q;
    var $rootScope;
    var $timeout;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(inject(function(_dataService_, _$q_, _$rootScope_, _$timeout_) {
        dataService = _dataService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    it('should expose getCards and getTransactions methods', function() {
        // Arrange & Act & Assert
        expect(dataService.getCards).toBeDefined();
        expect(typeof dataService.getCards).toBe('function');
        expect(dataService.getTransactions).toBeDefined();
        expect(typeof dataService.getTransactions).toBe('function');
    });

    it('getCards should resolve with an array of cards after simulated delay', function(done) {
        // Arrange
        var cardsResult;

        // Act
        dataService.getCards().then(function(cards) {
            cardsResult = cards;
        });

        // Fast-forward $timeout to resolve promise
        $timeout.flush(500);
        $rootScope.$apply();

        // Assert
        expect(Array.isArray(cardsResult)).toBe(true);
        expect(cardsResult.length).toBeGreaterThan(0);
        expect(cardsResult[0].hasOwnProperty('cardName')).toBe(true);
        done();
    });

    it('getTransactions should resolve with an array of transactions after simulated delay', function(done) {
        // Arrange
        var transactionsResult;

        // Act
        dataService.getTransactions().then(function(transactions) {
            transactionsResult = transactions;
        });

        // Fast-forward $timeout to resolve promise
        $timeout.flush(800);
        $rootScope.$apply();

        // Assert
        expect(Array.isArray(transactionsResult)).toBe(true);
        expect(transactionsResult.length).toBeGreaterThan(0);
        expect(transactionsResult[0].hasOwnProperty('merchant')).toBe(true);
        done();
    });

    it('getCards and getTransactions should work independently', function(done) {
        // Arrange
        var cardsResult;
        var transactionsResult;

        // Act
        dataService.getCards().then(function(cards) {
            cardsResult = cards;
        });
        dataService.getTransactions().then(function(transactions) {
            transactionsResult = transactions;
        });

        // Fast-forward both timeouts
        $timeout.flush(800);
        $rootScope.$apply();

        // Assert
        expect(Array.isArray(cardsResult)).toBe(true);
        expect(Array.isArray(transactionsResult)).toBe(true);
        expect(cardsResult.length).toBeGreaterThan(0);
        expect(transactionsResult.length).toBeGreaterThan(0);
        done();
    });

    it('should generate realistic transaction data with varying merchants and categories', function(done) {
        // Arrange
        var transactionsResult;

        // Act
        dataService.getTransactions().then(function(transactions) {
            transactionsResult = transactions;
        });
        $timeout.flush(800);
        $rootScope.$apply();

        // Assert
        var uniqueMerchants = {};
        var uniqueCategories = {};
        transactionsResult.forEach(function(tx) {
            uniqueMerchants[tx.merchant] = true;
            uniqueCategories[tx.category] = true;
        });
        expect(Object.keys(uniqueMerchants).length).toBeGreaterThan(1);
        expect(Object.keys(uniqueCategories).length).toBeGreaterThan(1);
        done();
    });

    it('should respect the promised-based API pattern and not reject under normal conditions', function(done) {
        // Arrange
        var cardsRejected = false;
        var txRejected = false;

        // Act
        dataService.getCards().catch(function() {
            cardsRejected = true;
        });
        dataService.getTransactions().catch(function() {
            txRejected = true;
        });
        $timeout.flush(800);
        $rootScope.$apply();

        // Assert
        expect(cardsRejected).toBe(false);
        expect(txRejected).toBe(false);
        done();
    });
});

/*
Test Documentation:
- Test Name: Service API exposure
- Purpose: Verify that dataService exposes public methods for cards and transactions.
- Scenario: Inject dataService and inspect available methods.
- Expected Result: getCards and getTransactions functions are defined.

- Test Name: getCards promise resolution
- Purpose: Ensure getCards returns a promise that resolves to an array of card objects.
- Scenario: Call getCards and flush the mocked timeout.
- Expected Result: The promise resolves with non-empty card array containing cardName property.

- Test Name: getTransactions promise resolution
- Purpose: Ensure getTransactions returns a promise that resolves to an array of transaction objects.
- Scenario: Call getTransactions and flush the mocked timeout.
- Expected Result: The promise resolves with non-empty transaction array containing merchant property.

- Test Name: Independent calls for cards and transactions
- Purpose: Confirm both methods can be used independently and concurrently.
- Scenario: Call both getCards and getTransactions before flushing timeouts.
- Expected Result: Both promises resolve with appropriate data.

- Test Name: Realistic transaction generation
- Purpose: Validate that generated transactions contain variety in merchants and categories.
- Scenario: Retrieve transactions and analyze merchant and category diversity.
- Expected Result: Multiple distinct merchants and categories present.

- Test Name: Normal condition rejection check
- Purpose: Ensure that under normal mocked behavior, promises do not reject.
- Scenario: Attach catch handlers to both promises and flush timeouts.
- Expected Result: Neither promise triggers rejection handler.
*/

/*
Coverage Report:
- Functions tested:
  - dataService.getCards
  - dataService.getTransactions
- Statements covered:
  - Creation of deferred objects for cards and transactions
  - Invocation of $timeout to simulate API delay
  - Resolution of promises with mock data arrays
  - Transaction generation loop and data diversity
- Branches covered:
  - Normal path where promises resolve successfully
  - Implicit branch where promises do not reject
- Error scenarios covered:
  - Basic check that promises do not reject under normal operation
- Uncovered scenarios:
  - Explicit rejection paths (service does not currently implement error cases)
  - Behavior under extreme transaction volumes or card lists
  - Validation of individual card and transaction fields beyond presence checks
*/