describe('MonthlySummaryController', function() {
    var $controller, $rootScope;
    var $routeParamsMock;
    var DashboardApiServiceMock;
    var NotificationServiceMock;
    var LoggingServiceMock;
    var ENV_CONFIG;
    var initialSummary;
    var vm;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $routeParamsMock = {};
        DashboardApiServiceMock = jasmine.createSpyObj('DashboardApiService', ['getMonthlySummary']);
        NotificationServiceMock = jasmine.createSpyObj('NotificationService', ['showWarning', 'showError']);
        LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'warn', 'error', 'audit']);

        ENV_CONFIG = {
            defaultMonthOffset: 0
        };

        $provide.value('$routeParams', $routeParamsMock);
        $provide.value('DashboardApiService', DashboardApiServiceMock);
        $provide.value('NotificationService', NotificationServiceMock);
        $provide.value('LoggingService', LoggingServiceMock);
        $provide.value('ENV_CONFIG', ENV_CONFIG);
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        initialSummary = {
            summary: {
                cardId: 'CARD999',
                month: '2026-07',
                isValid: function() { return true; }
            },
            kpis: [{ id: 'totalSpend' }],
            breakdown: [{ categoryName: 'Groceries', amount: 10, percentageOfTotal: 50 }]
        };

        vm = $controller('MonthlySummaryController as vm', {
            $routeParams: $routeParamsMock,
            DashboardApiService: DashboardApiServiceMock,
            NotificationService: NotificationServiceMock,
            LoggingService: LoggingServiceMock,
            ENV_CONFIG: ENV_CONFIG,
            initialSummary: initialSummary
        });
    }));

    function flushPromises() {
        $rootScope.$apply();
    }

    it('should initialize with route parameters when provided', function() {
        // Arrange
        $routeParamsMock.cardId = 'CARD123';
        $routeParamsMock.month = '2026-08';

        vm.initialize(initialSummary);

        // Assert
        expect(vm.cardId).toBe('CARD123');
        expect(vm.month).toBe('2026-08');
        expect(vm.summary).toBe(initialSummary.summary);
        expect(vm.kpis).toEqual(initialSummary.kpis);
        expect(vm.breakdownItems).toEqual(initialSummary.breakdown);
        expect(vm.isEmpty).toBe(false);
        expect(LoggingServiceMock.info).toHaveBeenCalled();
    });

    it('should use default cardId and month when route params not provided', function() {
        // Arrange
        $routeParamsMock.cardId = null;
        $routeParamsMock.month = null;
        var summaryWithMonth = {
            summary: {
                cardId: 'CARD999',
                month: '2026-07',
                isValid: function() { return true; }
            }
        };

        // Act
        vm.initialize(summaryWithMonth);

        // Assert
        expect(vm.cardId).toBe('CARD123');
        // Default month should come from initial.summary.month when defined
        expect(vm.month).toBe('2026-07');
        expect(vm.summary).toBe(summaryWithMonth.summary);
    });

    it('should use getDefaultMonth when initial summary month is missing', function() {
        // Arrange
        $routeParamsMock.cardId = null;
        $routeParamsMock.month = null;
        var initialWithoutMonth = { summary: { isValid: function() { return true; } } };

        // Act
        vm.initialize(initialWithoutMonth);

        // Assert
        expect(vm.cardId).toBe('CARD123');
        expect(vm.month).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    });

    it('should show warning when onMonthSelected is called with empty month', function() {
        // Arrange

        // Act
        vm.onMonthSelected('');

        // Assert
        expect(NotificationServiceMock.showWarning).toHaveBeenCalledWith('Please select a valid month.');
        expect(DashboardApiServiceMock.getMonthlySummary).not.toHaveBeenCalled();
    });

    it('should show warning when onMonthSelected is called with invalid month format', function() {
        // Arrange

        // Act
        vm.onMonthSelected('2026-13');

        // Assert
        expect(NotificationServiceMock.showWarning).toHaveBeenCalledWith('Please select a valid month.');
        expect(DashboardApiServiceMock.getMonthlySummary).not.toHaveBeenCalled();
    });

    it('should load monthly summary when valid month is selected', function() {
        // Arrange
        var promise = Promise.resolve(initialSummary);
        DashboardApiServiceMock.getMonthlySummary.and.returnValue(promise);

        // Act
        vm.onMonthSelected('2026-07');

        // Assert
        expect(vm.month).toBe('2026-07');
        expect(DashboardApiServiceMock.getMonthlySummary).toHaveBeenCalledWith(vm.cardId, '2026-07');
    });

    it('should handle successful loadMonthlySummary', function(done) {
        // Arrange
        var result = {
            summary: {
                cardId: 'CARDX',
                month: '2026-05',
                isValid: function() { return true; }
            },
            kpis: [{ id: 'kpi1' }],
            breakdown: [{ categoryName: 'Cat1', amount: 10, percentageOfTotal: 100 }]
        };
        DashboardApiServiceMock.getMonthlySummary.and.returnValue(Promise.resolve(result));

        // Act
        vm.loadMonthlySummary();

        // Assert
        expect(vm.isLoading).toBe(true);
        expect(vm.hasError).toBe(false);
        expect(vm.error).toBeNull();
        expect(vm.isEmpty).toBe(false);

        Promise.resolve().then(function() {
            expect(vm.summary).toBe(result.summary);
            expect(vm.kpis).toEqual(result.kpis);
            expect(vm.breakdownItems).toEqual(result.breakdown);
            expect(vm.isEmpty).toBe(false);
            expect(vm.isLoading).toBe(false);
            done();
        });
    });

    it('should handle failed loadMonthlySummary', function(done) {
        // Arrange
        var errorModel = { message: 'failure' };
        DashboardApiServiceMock.getMonthlySummary.and.returnValue(Promise.reject(errorModel));

        // Act
        vm.loadMonthlySummary();

        // Assert initial loading state
        expect(vm.isLoading).toBe(true);
        expect(vm.hasError).toBe(false);
        expect(vm.error).toBeNull();

        Promise.resolve().then(function() {
            expect(vm.hasError).toBe(true);
            expect(vm.error).toBe(errorModel);
            expect(NotificationServiceMock.showError).toHaveBeenCalledWith('Unable to retrieve spending information.');
            expect(vm.isLoading).toBe(false);
            done();
        });
    });

    it('should set empty state when applySummary receives invalid summary', function() {
        // Arrange
        var invalidResult = { summary: { isValid: function() { return false; } } };

        // Act
        vm.initialize(invalidResult);

        // Assert
        expect(vm.summary).toBeNull();
        expect(vm.kpis).toEqual([]);
        expect(vm.breakdownItems).toEqual([]);
        expect(vm.isEmpty).toBe(true);
    });

    it('should mark isEmpty true when breakdown is empty', function() {
        // Arrange
        var result = {
            summary: {
                cardId: 'CARDX',
                month: '2026-05',
                isValid: function() { return true; }
            },
            kpis: [],
            breakdown: []
        };

        // Act
        vm.initialize(result);

        // Assert
        expect(vm.summary).toBe(result.summary);
        expect(vm.kpis).toEqual([]);
        expect(vm.breakdownItems).toEqual([]);
        expect(vm.isEmpty).toBe(true);
    });

    it('should call loadMonthlySummary on retry', function() {
        // Arrange
        spyOn(vm, 'loadMonthlySummary').and.callThrough();
        DashboardApiServiceMock.getMonthlySummary.and.returnValue(Promise.resolve(initialSummary));

        // Act
        vm.retry();

        // Assert
        expect(vm.loadMonthlySummary).toHaveBeenCalled();
    });
});

/*
Test Documentation:
- Test Name: Initialization with route parameters
- Purpose: Validate that controller uses $routeParams when available.
- Scenario: Initialize with cardId and month in $routeParams.
- Expected Result: vm.cardId and vm.month reflect route params; summary, kpis, breakdown populated; LoggingService.info called.

- Test Name: Initialization with default card and month from initial summary
- Purpose: Ensure defaults are used when route params absent but initial summary has month.
- Scenario: Initialize with null $routeParams and initialSummary.summary.month present.
- Expected Result: vm.cardId equals 'CARD123'; vm.month from initial summary.

- Test Name: Initialization with computed default month
- Purpose: Ensure getDefaultMonth fallback when initial summary month missing.
- Scenario: Initialize with missing month in initial summary.
- Expected Result: vm.month is a valid YYYY-MM string.

- Test Name: onMonthSelected with empty month
- Purpose: Validate warning and no API call for empty selection.
- Scenario: Call onMonthSelected('').
- Expected Result: NotificationService.showWarning called; DashboardApiService.getMonthlySummary not called.

- Test Name: onMonthSelected with invalid month format
- Purpose: Validate regex validation and warning.
- Scenario: Call onMonthSelected('2026-13').
- Expected Result: NotificationService.showWarning called; no API call.

- Test Name: onMonthSelected with valid month
- Purpose: Ensure valid month triggers loadMonthlySummary.
- Scenario: Call onMonthSelected('2026-07').
- Expected Result: vm.month updated; DashboardApiService.getMonthlySummary invoked.

- Test Name: Successful loadMonthlySummary
- Purpose: Validate state transitions and summary application on success.
- Scenario: DashboardApiService.getMonthlySummary resolves.
- Expected Result: vm.summary, vm.kpis, vm.breakdownItems updated; vm.isLoading false; vm.isEmpty reflects breakdown.

- Test Name: Failed loadMonthlySummary
- Purpose: Validate error handling and notification.
- Scenario: DashboardApiService.getMonthlySummary rejects with errorModel.
- Expected Result: vm.hasError true; vm.error set; showError called; vm.isLoading false.

- Test Name: applySummary with invalid summary
- Purpose: Ensure controller sets empty state when summary is invalid.
- Scenario: initialize with result.summary.isValid() false.
- Expected Result: summary null; kpis/breakdown empty; isEmpty true.

- Test Name: applySummary with empty breakdown
- Purpose: Confirm isEmpty flag when breakdown array is empty.
- Scenario: Initialize with valid summary but empty breakdown.
- Expected Result: vm.isEmpty true.

- Test Name: retry behavior
- Purpose: Verify retry delegating to loadMonthlySummary.
- Scenario: Call vm.retry().
- Expected Result: loadMonthlySummary invoked.
*/

/*
Coverage Report:
- Functions tested:
  - initialize
  - onMonthSelected
  - loadMonthlySummary
  - retry
  - applySummary (via initialize and loadMonthlySummary)
  - getDefaultMonth (indirectly via initialize)
- Statements covered:
  - Route parameter reading and defaults
  - LoggingService.info call on initialization
  - Month selection validation and warnings
  - API call invocations and promise handlers (then, catch, finally)
  - Summary mapping to vm properties
  - Empty/invalid summary handling
- Branches covered:
  - Route params present vs absent
  - initial.summary.month present vs missing
  - Month selection: empty vs invalid vs valid
  - DashboardApiService promise resolved vs rejected
  - applySummary: valid vs invalid summary; empty vs non-empty breakdown
- Error scenarios covered:
  - Invalid month input
  - API call rejection path
- Uncovered scenarios:
  - Edge cases around getDefaultMonth with non-zero ENV_CONFIG.defaultMonthOffset
  - Extremely large breakdown arrays performance
*/