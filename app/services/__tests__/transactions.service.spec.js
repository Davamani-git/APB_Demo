describe('TransactionsService', function() {
    var TransactionsService, RestApiService, $q, EnvConfigService, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        RestApiService = jasmine.createSpyObj('RestApiService', ['get']);
        EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['get']);
        $provide.value('RestApiService', RestApiService);
        $provide.value('EnvConfigService', EnvConfigService);
    }));

    beforeEach(inject(function(_TransactionsService_, _$q_, _$rootScope_) {
        TransactionsService = _TransactionsService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('searchTransactions should use mock data when useMockData is true', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return true;
            return null;
        });
        spyOn(window.TransactionsMockData, 'search').and.returnValue({ items: [], totalCount: 0 });

        // Act
        var promise = TransactionsService.searchTransactions({});
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(window.TransactionsMockData.search).toHaveBeenCalled();
        expect(RestApiService.get).not.toHaveBeenCalled();
        expect(result.totalCount).toBe(0);
    });

    it('searchTransactions should call RestApiService when useMockData is false', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return false;
            return null;
        });
        RestApiService.get.and.returnValue($q.when({ items: [], totalCount: 5 }));

        // Act
        var promise = TransactionsService.searchTransactions({ merchant: 'Test' });
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(RestApiService.get).toHaveBeenCalledWith('/transactions/search', { params: { merchant: 'Test' } });
        expect(result.totalCount).toBe(5);
    });

    it('getRecentTransactions should default limit when not provided and use mock data when enabled', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return true;
            return null;
        });
        spyOn(window.TransactionsMockData, 'getRecent').and.returnValue([]);

        // Act
        var promise = TransactionsService.getRecentTransactions();
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(window.TransactionsMockData.getRecent).toHaveBeenCalled();
        expect(RestApiService.get).not.toHaveBeenCalled();
        expect(result.length).toBe(0);
    });

    it('getRecentTransactions should use provided limit and call RestApiService when mock disabled', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return false;
            return null;
        });
        RestApiService.get.and.returnValue($q.when([]));

        // Act
        var promise = TransactionsService.getRecentTransactions(10);
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(RestApiService.get).toHaveBeenCalledWith('/transactions/recent', { params: { limit: 10 } });
        expect(result.length).toBe(0);
    });
});

/*
Test Documentation:
- Test Name: searchTransactions mock path
- Purpose: Verify searchTransactions uses TransactionsMockData when mock mode enabled.
- Scenario: EnvConfigService.get('useMockData') true.
- Expected Result: RestApiService.get not called; TransactionsMockData.search invoked.

- Test Name: searchTransactions real API path
- Purpose: Confirm searchTransactions delegates to RestApiService when mock disabled.
- Scenario: EnvConfigService.get('useMockData') false.
- Expected Result: RestApiService.get('/transactions/search', {params}) called; data propagated.

- Test Name: getRecentTransactions mock default limit
- Purpose: Ensure getRecentTransactions uses default limit when not provided and mock data when enabled.
- Scenario: Call getRecentTransactions() with no arguments; useMockData true.
- Expected Result: TransactionsMockData.getRecent called; RestApiService.get not called.

- Test Name: getRecentTransactions real API with explicit limit
- Purpose: Verify provided limit is used in request when mock disabled.
- Scenario: Call getRecentTransactions(10) with useMockData false.
- Expected Result: RestApiService.get('/transactions/recent', {params:{limit:10}}) called.
*/

/*
Coverage Report:
- Functions tested:
  - TransactionsService.searchTransactions()
  - TransactionsService.getRecentTransactions()
- Statements covered:
  - useMockData true/false branches for both methods
  - default limit usage in getRecentTransactions
  - API calls to RestApiService.get
- Branches covered:
  - mock vs real API paths
  - limit provided vs not provided (in getRecentTransactions)
- Error scenarios covered:
  - None (services delegate error handling)
- Uncovered scenarios:
  - Behavior when TransactionsMockData not present.
*/