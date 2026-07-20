describe('transactionsTable directive and TransactionsTableController', function() {
    var $compile, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    function createElement() {
        $rootScope.transactions = [{ id: 'txn-1', transactionDate: new Date(), merchantName: 'Test', category: 'Shopping', cardName: 'Card', amount: 10, paymentStatus: 'PAID' }];
        $rootScope.totalCount = 20;
        $rootScope.filters = { page: 1, pageSize: 10, sortBy: 'date', sortDirection: 'desc' };
        $rootScope.onPageChange = jasmine.createSpy('onPageChange');
        $rootScope.onSortChange = jasmine.createSpy('onSortChange');

        var element = angular.element('<transactions-table transactions="transactions" total-count="totalCount" filters="filters" on-page-change="onPageChange(page)" on-sort-change="onSortChange(field)"></transactions-table>');
        $compile(element)($rootScope);
        $rootScope.$digest();
        return element;
    }

    it('should call onPageChange with current page when handlePageChange executed', function() {
        // Arrange
        var element = createElement();
        var controller = element.controller('transactionsTable') || element.controller('TransactionsTableController');

        // Act
        controller.handlePageChange();

        // Assert
        expect($rootScope.onPageChange).toHaveBeenCalledWith({ page: $rootScope.filters.page });
    });

    it('should call onSortChange with field when handleSort executed', function() {
        // Arrange
        var element = createElement();
        var controller = element.controller('transactionsTable') || element.controller('TransactionsTableController');

        // Act
        controller.handleSort('amount');

        // Assert
        expect($rootScope.onSortChange).toHaveBeenCalledWith({ field: 'amount' });
    });

    it('should not throw when callbacks are undefined', function() {
        // Arrange
        $rootScope.transactions = [];
        $rootScope.totalCount = 0;
        $rootScope.filters = { page: 1, pageSize: 10 };
        var element = angular.element('<transactions-table transactions="transactions" total-count="totalCount" filters="filters"></transactions-table>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();
        var controller = element.controller('transactionsTable') || element.controller('TransactionsTableController');

        // Assert
        expect(function() { controller.handlePageChange(); }).not.toThrow();
        expect(function() { controller.handleSort('amount'); }).not.toThrow();
    });
});

/*
Test Documentation:
- Test Name: handlePageChange callback
- Purpose: Verify controller invokes onPageChange with current page.
- Scenario: Directive compiled with on-page-change bound to spy.
- Expected Result: onPageChange called with object containing page.

- Test Name: handleSort callback
- Purpose: Ensure onSortChange is called with provided field.
- Scenario: Directive compiled with on-sort-change bound to spy; handleSort('amount').
- Expected Result: onSortChange called with object containing field 'amount'.

- Test Name: callbacks absent
- Purpose: Confirm controller methods do not throw when callbacks are not provided.
- Scenario: Compile directive without on-page-change or on-sort-change.
- Expected Result: handlePageChange and handleSort execute without errors.
*/

/*
Coverage Report:
- Functions tested:
  - TransactionsTableController.handlePageChange()
  - TransactionsTableController.handleSort()
- Statements covered:
  - Conditional checks for vm.onPageChange and vm.onSortChange
  - Invocation of provided callbacks with proper argument objects
- Branches covered:
  - Callbacks present vs absent
- Error scenarios covered:
  - Missing callbacks handled gracefully without throwing
- Uncovered scenarios:
  - Pagination directive integration (uib-pagination behavior) not unit-tested.
*/