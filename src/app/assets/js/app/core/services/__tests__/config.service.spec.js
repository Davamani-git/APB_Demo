describe('Service: ConfigService', function() {
  var ConfigService;

  beforeEach(module('appmrn25.shared'));

  beforeEach(inject(function(_ConfigService_) {
    ConfigService = _ConfigService_;
  }));

  it('should return API base URL with /dashboard suffix', function() {
    // Arrange & Act
    var url = ConfigService.getApiBaseUrl();

    // Assert
    expect(url).toBe('/api/v1/dashboard');
  });

  it('should return feature flags object with expected defaults', function() {
    // Arrange & Act
    var flags = ConfigService.getFeatureFlags();

    // Assert
    expect(flags.showMonthlySpendChart).toBe(true);
    expect(flags.showStaleDataBanner).toBe(true);
  });
});

/*
Test Documentation:
- Test Name: ConfigService behavior
- Purpose: Verify that configuration values are returned correctly.
- Scenario: Call getApiBaseUrl and getFeatureFlags.
- Expected Result: Base URL '/api/v1/dashboard'; featureFlags has showMonthlySpendChart and showStaleDataBanner true.
*/

/*
Coverage Report:
- Functions tested: getApiBaseUrl, getFeatureFlags.
- Statements covered: All returns and ENV_CONFIG object usage.
- Branches covered: None.
- Error scenarios covered: None.
- Uncovered scenarios: Alternate ENV configurations (not defined in current file).
*/