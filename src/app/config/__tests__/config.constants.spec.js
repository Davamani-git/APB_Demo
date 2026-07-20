describe('ENV_CONFIG constant', function() {
    var ENV_CONFIG;

    beforeEach(module('app'));

    beforeEach(inject(function(_ENV_CONFIG_) {
        ENV_CONFIG = _ENV_CONFIG_;
    }));

    it('should expose default configuration values', function() {
        // Arrange / Act

        // Assert
        expect(ENV_CONFIG.apiBaseUrl).toBe('/api');
        expect(ENV_CONFIG.apiTimeoutMs).toBe(15000);
        expect(ENV_CONFIG.useMockData).toBe(true);
        expect(ENV_CONFIG.maxLookbackMonths).toBe(12);
        expect(ENV_CONFIG.defaultMonthOffset).toBe(0);
        expect(ENV_CONFIG.featureFlags.enableCategoryDrilldown).toBe(true);
        expect(ENV_CONFIG.featureFlags.enableMultiMonthComparison).toBe(true);
        expect(ENV_CONFIG.telemetry.enableClientLogging).toBe(true);
    });

    it('should allow extension of configuration object at runtime', function() {
        // Arrange
        ENV_CONFIG.newProperty = 'test';

        // Act / Assert
        expect(ENV_CONFIG.newProperty).toBe('test');
    });
});

/*
Test Documentation:
- Test Name: Default ENV_CONFIG values
- Purpose: Verify that ENV_CONFIG constant is initialized with expected defaults.
- Scenario: Inject ENV_CONFIG from the app module.
- Expected Result: All core properties match the configuration source.

- Test Name: Runtime extension of ENV_CONFIG
- Purpose: Confirm ENV_CONFIG is a mutable object that can be extended.
- Scenario: Add a newProperty field to ENV_CONFIG.
- Expected Result: newProperty is accessible and equals 'test'.
*/

/*
Coverage Report:
- Functions tested:
  - No functions; constant object ENV_CONFIG
- Statements covered:
  - Retrieval of ENV_CONFIG from Angular injector
  - Property access for all default fields
  - Runtime mutation of ENV_CONFIG
- Branches covered:
  - N/A (no branching logic)
- Error scenarios covered:
  - N/A (no error handling logic)
- Uncovered scenarios:
  - External code mutating ENV_CONFIG in unexpected ways
*/