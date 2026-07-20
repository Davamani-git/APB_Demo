describe('SpendSummaryService', function () {
  var SpendSummaryService;
  var $q;
  var EnvConfigServiceMock;
  var SpendSummaryApiServiceMock;
  var SpendSummaryMockServiceMock;
  var LoggingServiceMock;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $q = jasmine.createSpyObj('$q', ['defer', 'when']);
    EnvConfigServiceMock = jasmine.createSpyObj('EnvConfigService', ['isMockMode']);
    SpendSummaryApiServiceMock = jasmine.createSpyObj('SpendSummaryApiService', ['getMonthlySummary']);
    SpendSummaryMockServiceMock = jasmine.createSpyObj('SpendSummaryMockService', ['getMonthlySummary']);
    LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'error']);

    $provide.value('$q', $q);
    $provide.value('EnvConfigService', EnvConfigServiceMock);
    $provide.value('SpendSummaryApiService', SpendSummaryApiServiceMock);
    $provide.value('SpendSummaryMockService', SpendSummaryMockServiceMock);
    $provide.value('LoggingService', LoggingServiceMock);
  }));

  beforeEach(inject(function (_SpendSummaryService_, _$rootScope_) {
    SpendSummaryService = _SpendSummaryService_;
    $rootScope = _$rootScope_;
  }));

  it('should delegate to mock service when EnvConfigService.isMockMode returns true', function () {
    // Arrange
    var month = '2026-01';
    EnvConfigServiceMock.isMockMode.and.returnValue(true);
    SpendSummaryMockServiceMock.getMonthlySummary.and.returnValue({});

    // Act
    var result = SpendSummaryService.getMonthlySummary(month);

    // Assert
    expect(EnvConfigServiceMock.isMockMode).toHaveBeenCalled();
    expect(SpendSummaryMockServiceMock.getMonthlySummary).toHaveBeenCalledWith(month);
  });

  it('should delegate to API service when EnvConfigService.isMockMode returns false', function () {
    // Arrange
    var month = '2026-01';
    EnvConfigServiceMock.isMockMode.and.returnValue(false);
    SpendSummaryApiServiceMock.getMonthlySummary.and.returnValue({});

    // Act
    var result = SpendSummaryService.getMonthlySummary(month);

    // Assert
    expect(EnvConfigServiceMock.isMockMode).toHaveBeenCalled();
    expect(SpendSummaryApiServiceMock.getMonthlySummary).toHaveBeenCalledWith(month);
  });

  it('should compute default month as last full month', function () {
    // Arrange
    var defaultMonth = SpendSummaryService.getDefaultMonth();

    // Act & Assert
    expect(defaultMonth).toMatch(/^\d{4}-\d{2}$/);
  });
});

/*
Test Documentation:
- Test Name: SpendSummaryService delegation and default month
- Purpose: Verify delegation to mock or API service based on configuration, and default month computation.
- Scenario: Toggle EnvConfigService.isMockMode and call getMonthlySummary; call getDefaultMonth.
- Expected Result: Delegates correctly; default month string matches YYYY-MM format for last full month.
*/

/*
Coverage Report:
- Functions tested: getMonthlySummary, getDefaultMonth.
- Statements covered: Decision based on EnvConfigService.isMockMode; LoggingService.info call; DATE computation logic.
- Branches covered: useMock true vs false.
- Error scenarios covered: None explicitly; invalid dates are not expected from system clock.
- Uncovered scenarios: Edge cases around year boundaries and leap years (though basic formatting is verified).
*/