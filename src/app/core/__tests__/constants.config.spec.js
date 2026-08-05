describe('ENV_CONFIG constant', function () {
  var ENV_CONFIG;

  beforeEach(module('timerApp'));

  beforeEach(inject(function (_ENV_CONFIG_) {
    ENV_CONFIG = _ENV_CONFIG_;
  }));

  it('should be defined on the timerApp module', function () {
    // Arrange & Act & Assert
    expect(ENV_CONFIG).toBeDefined();
  });

  it('should expose expected default environment configuration', function () {
    // Arrange & Act
    // ENV_CONFIG injected in beforeEach

    // Assert
    expect(ENV_CONFIG.env).toBe('dev');
    expect(ENV_CONFIG.apiBaseUrl).toBe('https://api.example.com');
    expect(ENV_CONFIG.enableStorage).toBe(true);
    expect(ENV_CONFIG.logLevel).toBe('info');
    expect(ENV_CONFIG.enableRemoteLogging).toBe(false);
  });

  it('should be immutable when treated as a constant (assignment does not affect original reference)', function () {
    // Arrange
    var originalEnv = ENV_CONFIG.env;

    // Act
    ENV_CONFIG.env = 'prod';

    // Assert
    expect(ENV_CONFIG.env).toBe('prod');
    expect(originalEnv).toBe('dev');
  });
});

/*
Test Documentation:
- Test Name: should be defined on the timerApp module
- Purpose: Verify that ENV_CONFIG is registered as a constant.
- Scenario: Inject ENV_CONFIG from timerApp.
- Expected Result: ENV_CONFIG is defined.

- Test Name: should expose expected default environment configuration
- Purpose: Validate default configuration values used by the application.
- Scenario: Access properties env, apiBaseUrl, enableStorage, logLevel, enableRemoteLogging.
- Expected Result: Properties match the literal values defined in constants.config.js.

- Test Name: should be immutable when treated as a constant (assignment does not affect original reference)
- Purpose: Document behavior when ENV_CONFIG is mutated at runtime.
- Scenario: Modify ENV_CONFIG.env within a test.
- Expected Result: The local object reflects the change; original literal definition remains as coded. (Angular constants are not deep-frozen.)
*/

/*
Coverage Report:
- Functions tested:
  - No functions; ENV_CONFIG is a configuration object constant
- Statements covered:
  - Registration of ENV_CONFIG constant
  - All property assignments within the constant literal
- Branches covered:
  - None; constant definition has no branching logic
- Error scenarios covered:
  - None; tests focus on configuration availability and values
- Uncovered scenarios:
  - Consumers of ENV_CONFIG reacting to mutated values (handled in their own unit tests)
*/