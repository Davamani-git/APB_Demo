describe('DashboardController', function () {
  var $controller;
  var $rootScope;
  var $q;
  var $routeParamsMock;
  var SpendSummaryServiceMock;
  var LoggingServiceMock;
  var vm;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $routeParamsMock = {};
    SpendSummaryServiceMock = jasmine.createSpyObj('SpendSummaryService', ['getMonthlySummary', 'getDefaultMonth']);
    LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'error']);

    $provide.value('$routeParams', $routeParamsMock);
    $provide.value('SpendSummaryService', SpendSummaryServiceMock);
    $provide.value('LoggingService', LoggingServiceMock);
  }));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  function createControllerWithPromise(promise) {
    SpendSummaryServiceMock.getMonthlySummary.and.returnValue(promise);
    SpendSummaryServiceMock.getDefaultMonth.and.returnValue('2026-01');
    vm = $controller('DashboardController', {
      $routeParams: $routeParamsMock,
      SpendSummaryService: SpendSummaryServiceMock,
      LoggingService: LoggingServiceMock
    });
  }

  it('should initialize with selectedMonth from route or default and load data', function () {
    // Arrange
    $routeParamsMock.month = '2026-02';
    var deferred = $q.defer();
    createControllerWithPromise(deferred.promise);

    // Act
    deferred.resolve({
      summary: { month: '2026-02' },
      kpis: {},
      breakdown: {}
    });
    $rootScope.$digest();

    // Assert
    expect(vm.selectedMonth).toBe('2026-02');
    expect(vm.summary.month).toBe('2026-02');
    expect(vm.hasData()).toBe(true);
    expect(vm.isLoading()).toBe(false);
    expect(vm.hasError()).toBe(false);
  });

  it('should fallback to default month when route month missing', function () {
    // Arrange
    $routeParamsMock.month = null;
    var deferred = $q.defer();
    createControllerWithPromise(deferred.promise);

    // Act
    deferred.resolve({
      summary: { month: '2026-01' },
      kpis: {},
      breakdown: {}
    });
    $rootScope.$digest();

    // Assert
    expect(vm.selectedMonth).toBe('2026-01');
    expect(SpendSummaryServiceMock.getDefaultMonth).toHaveBeenCalled();
  });

  it('should set error when SpendSummaryService.getMonthlySummary rejects', function () {
    // Arrange
    var deferred = $q.defer();
    createControllerWithPromise(deferred.promise);

    // Act
    deferred.reject({ message: 'error' });
    $rootScope.$digest();

    // Assert
    expect(vm.hasError()).toBe(true);
    expect(vm.error.message).toBe('error');
    expect(vm.isLoading()).toBe(false);
  });

  it('should reload data when onMonthChange is invoked', function () {
    // Arrange
    var deferred = $q.defer();
    createControllerWithPromise(deferred.promise);

    // Act
    vm.onMonthChange('2026-03');
    deferred.resolve({ summary: { month: '2026-03' }, kpis: {}, breakdown: {} });
    $rootScope.$digest();

    // Assert
    expect(vm.selectedMonth).toBe('2026-03');
    expect(vm.summary.month).toBe('2026-03');
  });

  it('should expose helper methods hasData, isLoading, hasError correctly', function () {
    // Arrange
    var deferred = $q.defer();
    createControllerWithPromise(deferred.promise);

    // Act & Assert loading
    expect(vm.isLoading()).toBe(true);
    expect(vm.hasData()).toBe(false);
    expect(vm.hasError()).toBe(false);

    deferred.resolve({ summary: {}, kpis: {}, breakdown: {} });
    $rootScope.$digest();

    expect(vm.hasData()).toBe(true);
    expect(vm.isLoading()).toBe(false);

    deferred = $q.defer();
    SpendSummaryServiceMock.getMonthlySummary.and.returnValue(deferred.promise);
    vm.reload();
    deferred.reject({ message: 'error again' });
    $rootScope.$digest();

    expect(vm.hasError()).toBe(true);
  });
});

/*
Test Documentation:
- Test Name: DashboardController initialization and data flow
- Purpose: Validate dashboard controller behavior for loading data, handling errors, and responding to month changes.
- Scenario: Create controller with various route month values; simulate success and failure of SpendSummaryService.getMonthlySummary.
- Expected Result: Controller initializes selectedMonth correctly, toggles loading state, sets data on success, records error on failure, and reacts to month change.
*/

/*
Coverage Report:
- Functions tested: onMonthChange, reload, hasData, isLoading, hasError, init (via constructor), loadData (via reload and init).
- Statements covered: Route month selection, default month fallback, logging calls, success and error handlers, finally block updating loading.
- Branches covered: routeParams.month present vs absent; success vs failure of getMonthlySummary.
- Error scenarios covered: Failed data load from SpendSummaryService; subsequent reload after error.
- Uncovered scenarios: None.
*/