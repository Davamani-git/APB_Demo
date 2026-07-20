describe('monthSelector directive', function() {
    var $compile, $rootScope;
    var $scope;
    var element;
    var ENV_CONFIG;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        ENV_CONFIG = {
            maxLookbackMonths: 3
        };
        $provide.value('ENV_CONFIG', ENV_CONFIG);
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $scope.selectedMonth = '2026-07';
        $scope.onChangeHandler = jasmine.createSpy('onChangeHandler');

        element = $compile('<month-selector selected-month="selectedMonth" on-change="onChangeHandler(month)"></month-selector>')($scope);
        $scope.$digest();
    }));

    it('should build availableMonths based on ENV_CONFIG.maxLookbackMonths', function() {
        // Arrange
        var isolateScope = element.isolateScope().vm;

        // Act
        var months = isolateScope.availableMonths;

        // Assert
        expect(months.length).toBe(ENV_CONFIG.maxLookbackMonths);
        months.forEach(function(m) {
            expect(m.value).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
            expect(m.label).toBe(m.value);
        });
    });

    it('should initialize internalSelectedMonth from selectedMonth', function() {
        // Arrange
        var vm = element.isolateScope().vm;

        // Assert
        expect(vm.internalSelectedMonth).toBe('2026-07');
    });

    it('should update selectedMonth and call onChange when changeMonth is invoked', function() {
        // Arrange
        var vm = element.isolateScope().vm;
        vm.internalSelectedMonth = '2026-06';

        // Act
        vm.changeMonth();

        // Assert
        expect($scope.selectedMonth).toBe('2026-06');
        expect($scope.onChangeHandler).toHaveBeenCalledWith('2026-06');
    });
});

/*
Test Documentation:
- Test Name: Available months generation
- Purpose: Validate buildAvailableMonths uses ENV_CONFIG.maxLookbackMonths and proper formatting.
- Scenario: Compile directive with maxLookbackMonths=3.
- Expected Result: availableMonths has 3 entries, each labeled as YYYY-MM.

- Test Name: Internal selected month initialization
- Purpose: Ensure controller copies initial selectedMonth into internalSelectedMonth.
- Scenario: Initial selectedMonth='2026-07'.
- Expected Result: vm.internalSelectedMonth equals '2026-07'.

- Test Name: Month change behavior
- Purpose: Confirm changeMonth updates bound selectedMonth and triggers callback.
- Scenario: Set internalSelectedMonth to '2026-06' and call changeMonth.
- Expected Result: selectedMonth updated; onChange called with new month.
*/

/*
Coverage Report:
- Functions tested:
  - buildAvailableMonths
  - changeMonth
- Statements covered:
  - Loop over ENV_CONFIG.maxLookbackMonths
  - Date calculations and string formatting
  - Assignment of vm.selectedMonth and callback invocation
- Branches covered:
  - For-loop iterations across lookback range
- Error scenarios covered:
  - N/A (no explicit error handling)
- Uncovered scenarios:
  - ENV_CONFIG.maxLookbackMonths = 0 or negative
  - onChange not provided
*/