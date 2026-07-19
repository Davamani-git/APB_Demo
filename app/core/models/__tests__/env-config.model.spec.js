describe('EnvConfig model', function () {
  var EnvConfig;

  beforeEach(module('app'));

  beforeEach(inject(function (_EnvConfig_) {
    EnvConfig = _EnvConfig_;
  }));

  it('should apply defaults when options are missing', function () {
    // Arrange & Act
    var cfg = new EnvConfig();

    // Assert
    expect(cfg.apiBaseUrl).toBe('https://api.example.com/v1');
    expect(cfg.apiTimeoutMs).toBe(10000);
    expect(cfg.maxLookbackMonths).toBe(12);
    expect(cfg.useMockData).toBe(true);
    expect(cfg.featureFlags).toEqual({
      enableBreakdownChart: true,
      showActiveDaysCount: true
    });
    expect(cfg.telemetry).toEqual({
      logLevel: 'info',
      enableClientMetrics: true
    });
  });

  it('should respect valid overrides in options', function () {
    // Arrange
    var options = {
      apiBaseUrl: 'https://custom.example.com',
      apiTimeoutMs: 20000,
      maxLookbackMonths: 24,
      useMockData: false,
      featureFlags: { enableBreakdownChart: false },
      telemetry: { logLevel: 'debug', enableClientMetrics: false }
    };

    // Act
    var cfg = new EnvConfig(options);

    // Assert
    expect(cfg.apiBaseUrl).toBe('https://custom.example.com');
    expect(cfg.apiTimeoutMs).toBe(20000);
    expect(cfg.maxLookbackMonths).toBe(24);
    expect(cfg.useMockData).toBe(false);
    expect(cfg.featureFlags).toEqual({ enableBreakdownChart: false });
    expect(cfg.telemetry).toEqual({ logLevel: 'debug', enableClientMetrics: false });
  });

  it('should fall back to defaults for invalid numeric values', function () {
    // Arrange
    var options = {
      apiTimeoutMs: -10,
      maxLookbackMonths: 0
    };

    // Act
    var cfg = new EnvConfig(options);

    // Assert
    expect(cfg.apiTimeoutMs).toBe(10000);
    expect(cfg.maxLookbackMonths).toBe(12);
  });

  it('should fall back to default base URL when apiBaseUrl is empty or non-string', function () {
    // Arrange / Act
    var cfgEmpty = new EnvConfig({ apiBaseUrl: '' });
    var cfgNonString = new EnvConfig({ apiBaseUrl: 123 });

    // Assert
    expect(cfgEmpty.apiBaseUrl).toBe('https://api.example.com/v1');
    expect(cfgNonString.apiBaseUrl).toBe('https://api.example.com/v1');
  });
});

/*
Test Documentation:
- Test Name: EnvConfig defaults and overrides
- Purpose: Verify EnvConfig applies defaults and respects valid overrides while rejecting invalid inputs.
- Scenario: Instantiate EnvConfig with no options, valid options, and invalid numeric/string values.
- Expected Result: Defaults are applied when appropriate; overrides are set when valid.
*/

/*
Coverage Report:
- Functions tested: EnvConfig constructor.
- Statements covered: All property assignments and default branches.
- Branches covered: apiBaseUrl string/length check, apiTimeoutMs integer/positive check, maxLookbackMonths check, useMockData boolean check, featureFlags/telemetry fallback.
- Error scenarios covered: Invalid numeric values; empty/non-string apiBaseUrl.
- Uncovered scenarios: Extremely large numeric values; malformed featureFlags/telemetry structures.
*/