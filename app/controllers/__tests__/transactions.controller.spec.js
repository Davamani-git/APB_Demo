describe('TransactionsController', function() {
    var $controller, TransactionsService, LoggingService, ErrorHandlerService, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        TransactionsService = jasmine.createSpyObj('TransactionsService', ['searchTransactions']);
        LoggingService = jasmine.createSpyObj('LoggingService', ['info', 'error']);
        ErrorHandlerService = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

        $provide.value('TransactionsService', TransactionsService);
        $provide.value('LoggingService', LoggingService);
        $provide.value('ErrorHandlerService', ErrorHandlerService);
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_, $q) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;

        TransactionsService.searchTransactions.and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve({ items: [{ id: 'txn-1' }], totalCount: 1 });
            return deferred.promise;
        });
    }));

    function createController() {
        return $controller('TransactionsController', {
            TransactionsService: TransactionsService,
            LoggingService: LoggingService,
            ErrorHandlerService: ErrorHandlerService
        });
    }

    it('should initialize filters and perform initial search on activate', function() {
        // Arrange & Act
        var vm = createController();
        $rootScope.$apply();

        // Assert
        expect(LoggingService.info).toHaveBeenCalledWith('TransactionsController activated');
        expect(TransactionsService.searchTransactions).toHaveBeenCalledWith(vm.filters);
        expect(vm.filters.page).toBe(1);
        expect(vm.filters.pageSize).toBe(10);
    });

    it('should update transactions and totalCount on successful search', function() {
        // Arrange
        var vm = createController();

        // Act
        vm.search();
        expect(vm.isLoading).toBe(true);
        $rootScope.$apply();

        // Assert
        expect(vm.isLoading).toBe(false);
        expect(vm.transactions.length).toBe(1);
        expect(vm.totalCount).toBe(1);
        expect(LoggingService.info).toHaveBeenCalledWith('Transactions search successful', { count: 1 });
        expect(vm.error).toBeNull();
    });

    it('should handle error during search via ErrorHandlerService', function() {
        // Arrange
        inject(function($q) {
            TransactionsService.searchTransactions.and.callFake(function() {
                var deferred = $q.defer();
                deferred.reject({ status: 500 });
                return deferred.promise;
            });
        });
        var vm = createController();
        var errorModel = { message: 'Failed to search for transactions.' };
        ErrorHandlerService.handleError.and.returnValue(errorModel);

        // Act
        vm.search();
        $rootScope.$apply();

        // Assert
        expect(vm.error).toBe(errorModel);
        expect(LoggingService.error).toHaveBeenCalledWith('Error searching transactions', { status: 500 });
        expect(vm.isLoading).toBe(false);
    });

    it('should change page and trigger search', function() {
        // Arrange
        var vm = createController();
        spyOn(vm, 'search');

        // Act
        vm.changePage(3);

        // Assert
        expect(vm.filters.page).toBe(3);
        expect(vm.search).toHaveBeenCalled();
    });

    it('should sort by new field and set direction to desc', function() {
        // Arrange
        var vm = createController();
        spyOn(vm, 'search');
        vm.filters.sortBy = 'date';
        vm.filters.sortDirection = 'asc';

        // Act
        vm.sortBy('amount');

        // Assert
        expect(vm.filters.sortBy).toBe('amount');
        expect(vm.filters.sortDirection).toBe('desc');
        expect(vm.search).toHaveBeenCalled();
    });

    it('should toggle sort direction when sorting by same field', function() {
        // Arrange
        var vm = createController();
        spyOn(vm, 'search');
        vm.filters.sortBy = 'amount';
        vm.filters.sortDirection = 'asc';

        // Act
        vm.sortBy('amount');

        // Assert
        expect(vm.filters.sortDirection).toBe('desc');
        expect(vm.search).toHaveBeenCalled();
    });
});

/*
Test Documentation:
- Test Name: TransactionsController activation
- Purpose: Verify controller initializes filters and performs an initial search.
- Scenario: Instantiate controller; activate() calls search().
- Expected Result: LoggingService.info called; TransactionsService.searchTransactions invoked with filters.

- Test Name: Successful search behavior
- Purpose: Ensure transactions and totalCount are updated on success and loading state handled.
- Scenario: search() calls service which resolves with items and totalCount.
- Expected Result: isLoading toggles, transactions populated, LoggingService.info called, error cleared.

- Test Name: Search error handling
- Purpose: Validate error path uses ErrorHandlerService and logs error.
- Scenario: TransactionsService.searchTransactions rejects; ErrorHandlerService.handleError returns error model.
- Expected Result: vm.error set to model, LoggingService.error called, isLoading false.

- Test Name: changePage behavior
- Purpose: Confirm page changes update filters and re-trigger search.
- Scenario: changePage() called with new page.
- Expected Result: filters.page updated; search() called.

- Test Name: sortBy new field
- Purpose: Ensure sorting by a new field sets sortBy and direction desc then searches.
- Scenario: sortBy('amount') when current sortBy is 'date'.
- Expected Result: filters.sortBy 'amount', filters.sortDirection 'desc', search() called.

- Test Name: sortBy toggle direction
- Purpose: Confirm sorting by existing field toggles direction and triggers search.
- Scenario: sortBy('amount') when filters.sortBy already 'amount'.
- Expected Result: filters.sortDirection toggled from asc to desc; search() called.
*/

/*
Coverage Report:
- Functions tested:
  - TransactionsController constructor
  - activate()
  - search()
  - changePage()
  - sortBy()
- Statements covered:
  - Initialization of filters and state fields
  - LoggingService.info activation and search success
  - Promise handling in search (then/catch/finally)
  - pagination and sorting logic
- Branches covered:
  - Successful search path
  - Error search path
  - sortBy when field changes vs matches current
- Error scenarios covered:
  - Service rejection leading to ErrorHandlerService.handleError and LoggingService.error
- Uncovered scenarios:
  - Validation of filter date range or invalid filter values (not present in controller).
*/