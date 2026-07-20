describe('ENV_CONFIG constant', function() {
    var ENV_CONFIG;

    beforeEach(module('app'));

    beforeEach(inject(function(_ENV_CONFIG_) {
        ENV_CONFIG = _ENV_CONFIG_;
    }));

    it('should define default ENV_CONFIG values', function() {
        // Arrange & Act
        // constant injected

        // Assert
        expect(ENV_CONFIG.apiBaseUrl).toBe('/api');
        expect(ENV_CONFIG.apiTimeoutMs).toBe(15000);
        expect(ENV_CONFIG.useMockData).toBe(true);
        expect(ENV_CONFIG.debugMode).toBe(true);
        expect(ENV_CONFIG.featureFlags.enableBudget).toBe(true);
        expect(ENV_CONFIG.featureFlags.enableAnalytics).toBe(true);
        expect(ENV_CONFIG.telemetry.enabled).toBe(false);
    });
});

/*
Test Documentation:
- Test Name: ENV_CONFIG default values
- Purpose: Ensure fallback configuration constant is defined with expected defaults.
- Scenario: Inject ENV_CONFIG from app module.
- Expected Result: Properties match those specified in config.constants.js.
*/

/*
Coverage Report:
- Functions tested:
  - None (constant object only)
- Statements covered:
  - ENV_CONFIG constant definition and property values
- Branches covered:
  - None (static constant)
- Error scenarios covered:
  - None (no logic)
- Uncovered scenarios:
  - Alternative configurations when JSON overrides are loaded (covered by EnvConfigService tests).
*/