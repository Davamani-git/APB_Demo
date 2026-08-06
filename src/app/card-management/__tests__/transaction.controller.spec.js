(function() {
  'use strict';

  describe('TransactionController', function() {
    var vm, TransactionService, $q, $rootScope, $scope;

    beforeEach(module('cardManagement'));

    beforeEach(inject(function($controller, _$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      TransactionService = jasmine.createSpyObj('TransactionService', ['getTransactions']);

      vm = $controller('TransactionController', {
        TransactionService: TransactionService,
        $scope: $scope
      });
    }));

    /*
    Test Documentation:
    - Test Name: should initialize with default values
    - Purpose: Verify controller initialization
    - Scenario: Controller is instantiated
    - Expected Result: Default properties are set correctly
    */
    it('should initialize with default values', function() {
      expect(vm.transactions).toEqual([]);
      expect(vm.loading).toBe(false);
      expect(vm.error).toBe(null);
      expect(vm.filters).toBeDefined();
      expect(vm.filters.pageNumber).toBe(1);
      expect(vm.filters.pageSize).toBe(20);
      expect(vm.currentCardId).toBe(null);
    });

    /*
    Test Documentation:
    - Test Name: should load transactions on cardSelected event
    - Purpose: Verify event listener for card selection
    - Scenario: cardSelected event is broadcast
    - Expected Result: currentCardId is set, filters reset, loadTransactions called
    */
    it('should load transactions on cardSelected event', function() {
      spyOn(vm, 'loadTransactions');
      var card = { cardId: 123 };

      $scope.$broadcast('cardSelected', card);

      expect(vm.currentCardId).toBe(123);
      expect(vm.filters.pageNumber).toBe(1);
      expect(vm.loadTransactions).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: loadTransactions should not execute if no cardId
    - Purpose: Verify guard clause for missing cardId
    - Scenario: loadTransactions is called without currentCardId
    - Expected Result: Service is not called, function returns early
    */
    it('loadTransactions should not execute if no cardId', function() {
      vm.currentCardId = null;

      vm.loadTransactions();

      expect(TransactionService.getTransactions).not.toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: loadTransactions should fetch transactions successfully
    - Purpose: Verify successful transaction loading
    - Scenario: TransactionService returns transactions
    - Expected Result: Transactions are set, loading is false
    */
    it('loadTransactions should fetch transactions successfully', function() {
      var mockTransactions = [
        { date: '2023-01-01', merchantName: 'Store A', amount: 100 },
        { date: '2023-01-02', merchantName: 'Store B', amount: 200 }
      ];
      vm.currentCardId = 123;
      TransactionService.getTransactions.and.returnValue($q.resolve(mockTransactions));

      vm.loadTransactions();
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);

      $rootScope.$digest();

      expect(vm.transactions).toEqual(mockTransactions);
      expect(vm.loading).toBe(false);
      expect(TransactionService.getTransactions).toHaveBeenCalledWith(123, vm.filters);
    });

    /*
    Test Documentation:
    - Test Name: loadTransactions should handle errors
    - Purpose: Verify error handling during transaction loading
    - Scenario: TransactionService rejects promise
    - Expected Result: Error message is set, transactions cleared, loading is false
    */
    it('loadTransactions should handle errors', function() {
      vm.currentCardId = 123;
      TransactionService.getTransactions.and.returnValue($q.reject('API Error'));

      vm.loadTransactions();
      $rootScope.$digest();

      expect(vm.error).toBe('Failed to load transactions');
      expect(vm.loading).toBe(false);
      expect(vm.transactions).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: applyFilters should reset page and reload transactions
    - Purpose: Verify filter application
    - Scenario: User applies filters
    - Expected Result: Page number is reset to 1, loadTransactions is called
    */
    it('applyFilters should reset page and reload transactions', function() {
      vm.filters.pageNumber = 5;
      spyOn(vm, 'loadTransactions');

      vm.applyFilters();

      expect(vm.filters.pageNumber).toBe(1);
      expect(vm.loadTransactions).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: nextPage should increment page number and reload
    - Purpose: Verify pagination forward
    - Scenario: User clicks next page
    - Expected Result: Page number increases by 1, loadTransactions is called
    */
    it('nextPage should increment page number and reload', function() {
      vm.filters.pageNumber = 1;
      spyOn(vm, 'loadTransactions');

      vm.nextPage();

      expect(vm.filters.pageNumber).toBe(2);
      expect(vm.loadTransactions).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: previousPage should decrement page number and reload
    - Purpose: Verify pagination backward
    - Scenario: User clicks previous page from page 2
    - Expected Result: Page number decreases by 1, loadTransactions is called
    */
    it('previousPage should decrement page number and reload', function() {
      vm.filters.pageNumber = 2;
      spyOn(vm, 'loadTransactions');

      vm.previousPage();

      expect(vm.filters.pageNumber).toBe(1);
      expect(vm.loadTransactions).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: previousPage should not go below page 1
    - Purpose: Verify pagination boundary
    - Scenario: User clicks previous on page 1
    - Expected Result: Page number stays at 1, loadTransactions is not called
    */
    it('previousPage should not go below page 1', function() {
      vm.filters.pageNumber = 1;
      spyOn(vm, 'loadTransactions');

      vm.previousPage();

      expect(vm.filters.pageNumber).toBe(1);
      expect(vm.loadTransactions).not.toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple cardSelected events
    - Purpose: Verify controller handles card switching
    - Scenario: Multiple cards are selected in sequence
    - Expected Result: Each selection updates cardId and reloads transactions
    */
    it('should handle multiple cardSelected events', function() {
      spyOn(vm, 'loadTransactions');

      $scope.$broadcast('cardSelected', { cardId: 1 });
      expect(vm.currentCardId).toBe(1);
      expect(vm.loadTransactions).toHaveBeenCalledTimes(1);

      $scope.$broadcast('cardSelected', { cardId: 2 });
      expect(vm.currentCardId).toBe(2);
      expect(vm.loadTransactions).toHaveBeenCalledTimes(2);
    });

    /*
    Coverage Report:
    - Functions tested: loadTransactions, applyFilters, nextPage, previousPage, cardSelected event handler
    - Statements/branches covered: Initialization, event listening, successful transaction loading, error handling, pagination forward/backward, boundary conditions, filter application
    - Error scenarios covered: API failure, missing cardId, page boundary violations
    - Uncovered scenarios: None - all public methods and error paths tested
    */
  });
})();