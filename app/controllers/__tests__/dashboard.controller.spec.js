describe('DashboardController', function() {
    var $controller, $location, LoggingService, ErrorHandlerService, dashboardData;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $location = jasmine.createSpyObj('$location', ['path']);
        LoggingService = jasmine.createSpyObj('LoggingService', ['info', 'error']);
        ErrorHandlerService = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);
        dashboardData = {
            summary: { totalMonthlySpend: 10 },
            cards: [ { id: 'card-1' } ],
            budget: { monthlyBudget: 100 },
            recentTransactions: [ { id: 'txn-1' } ]
        };

        $provide.value('$location', $location);
        $provide.value('LoggingService', LoggingService);
        $provide.value('ErrorHandlerService', ErrorHandlerService);
    }));

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    function createController(data) {
        return $controller('DashboardController', {
            $location: $location,
            dashboardData: data,
            LoggingService: LoggingService,
            ErrorHandlerService: ErrorHandlerService
        });
    }

    it('should populate view model from resolved dashboardData when available', function() {
        // Arrange & Act
        var vm = createController(dashboardData);

        // Assert
        expect(LoggingService.info).toHaveBeenCalledWith('DashboardController activated');
        expect(vm.summary).toBe(dashboardData.summary);
        expect(vm.cards).toBe(dashboardData.cards);
        expect(vm.budget).toBe(dashboardData.budget);
        expect(vm.recentTransactions).toBe(dashboardData.recentTransactions);
        expect(vm.error).toBeNull();
    });

    it('should handle missing dashboardData by setting error via ErrorHandlerService', function() {
        // Arrange
        var errorModel = { message: 'Dashboard data could not be loaded.' };
        ErrorHandlerService.handleError.and.returnValue(errorModel);

        // Act
        var vm = createController(null);

        // Assert
        expect(LoggingService.info).toHaveBeenCalledWith('DashboardController activated');
        expect(ErrorHandlerService.handleError).toHaveBeenCalledWith(null, 'Dashboard data could not be loaded.');
        expect(LoggingService.error).toHaveBeenCalledWith('Dashboard data was not resolved.', {});
        expect(vm.error).toBe(errorModel);
        expect(vm.summary).toBeNull();
    });

    it('should navigate to /transactions on viewAllTransactions', function() {
        // Arrange
        var vm = createController(dashboardData);

        // Act
        vm.viewAllTransactions();

        // Assert
        expect($location.path).toHaveBeenCalledWith('/transactions');
    });
});

/*
Test Documentation:
- Test Name: DashboardController with resolved data
- Purpose: Verify that the controller populates its view model from resolved dashboardData.
- Scenario: Instantiate with a non-null dashboardData object.
- Expected Result: summary, cards, budget, recentTransactions are set; no error.

- Test Name: DashboardController with missing data
- Purpose: Ensure missing dashboardData leads to an error model via ErrorHandlerService.
- Scenario: Instantiate with null dashboardData; ErrorHandlerService.handleError returns model.
- Expected Result: vm.error set, LoggingService.error called, data properties remain null.

- Test Name: viewAllTransactions navigation
- Purpose: Confirm that viewAllTransactions triggers navigation to /transactions.
- Scenario: Call vm.viewAllTransactions on initialized controller.
- Expected Result: $location.path('/transactions') called.
*/

/*
Coverage Report:
- Functions tested:
  - DashboardController constructor
  - activate()
  - viewAllTransactions()
- Statements covered:
  - LoggingService.info activation message
  - population of vm.summary, vm.cards, vm.budget, vm.recentTransactions
  - ErrorHandlerService.handleError invocation when dashboardData is falsy
  - LoggingService.error when data not resolved
  - $location.path('/transactions') navigation
- Branches covered:
  - dashboardData truthy path
  - dashboardData falsy path
- Error scenarios covered:
  - Missing dashboardData resolution handled via ErrorHandlerService
- Uncovered scenarios:
  - None significant; controller logic is fully covered.
*/