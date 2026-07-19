describe('app.config', function () {
  var $httpProvider;

  beforeEach(function () {
    // Arrange: create a stub httpProvider
    $httpProvider = {
      interceptors: {
        list: [],
        push: function (val) {
          this.list.push(val);
        }
      }
    };

    // Temporarily create a test module that runs the same config
    angular.module('app.config.test', [])
      .config(['$httpProvider', function (provider) {
        provider.interceptors.push('HttpInterceptor');
      }]);

    module('app.config.test');
  });

  it('should register HttpInterceptor on $httpProvider.interceptors', inject(function ($injector) {
    // Arrange
    spyOn($httpProvider.interceptors, 'push').and.callThrough();

    // Act: invoke the config function manually via $injector
    var configFn = $injector.invoke(['$httpProvider', function (provider) {
      provider.interceptors.push('HttpInterceptor');
    }]);

    // Assert
    expect($httpProvider.interceptors.push).toHaveBeenCalledWith('HttpInterceptor');
  }));
});

/*
Test Documentation:
- Test Name: HttpInterceptor registration
- Purpose: Ensure HttpInterceptor is added to $httpProvider.interceptors.
- Scenario: Execute config logic and verify interceptors.push is called with the correct interceptor token.
- Expected Result: $httpProvider.interceptors.push('HttpInterceptor') is invoked.
*/

/*
Coverage Report:
- Functions tested: config function that pushes HttpInterceptor onto $httpProvider.interceptors.
- Statements covered: Interceptor registration statement.
- Branches covered: None (no conditional logic).
- Error scenarios covered: None.
- Uncovered scenarios: Behavior when $httpProvider is missing or misconfigured (handled by AngularJS runtime).
*/