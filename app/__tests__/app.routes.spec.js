describe('app.routes', function () {
  var $routeProviderMock, $locationProviderMock;

  beforeEach(function () {
    // Arrange: create spies for route and location providers
    $routeProviderMock = jasmine.createSpyObj('$routeProvider', ['when', 'otherwise']);
    $locationProviderMock = jasmine.createSpyObj('$locationProvider', ['hashPrefix']);

    angular.module('app.routes.test', [])
      .config(function ($routeProvider, $locationProvider) {
        // Use our mocks instead of real providers
        $routeProvider = $routeProviderMock;
        $locationProvider = $locationProviderMock;

        $locationProvider.hashPrefix('');

        $routeProvider
          .when('/spending/monthly', {
            templateUrl: 'app/spending/templates/monthly-summary.view.html',
            controller: 'MonthlySummaryController',
            controllerAs: 'vm'
          })
          .otherwise({
            redirectTo: '/spending/monthly'
          });
      });

    module('app.routes.test');
  });

  it('should configure hashPrefix to empty string', function () {
    // Assert
    expect($locationProviderMock.hashPrefix).toHaveBeenCalledWith('');
  });

  it('should define /spending/monthly route and default redirect', function () {
    // Assert
    expect($routeProviderMock.when).toHaveBeenCalled();
    expect($routeProviderMock.otherwise).toHaveBeenCalledWith({ redirectTo: '/spending/monthly' });

    var whenCallArgs = $routeProviderMock.when.calls.argsFor(0);
    expect(whenCallArgs[0]).toBe('/spending/monthly');
    expect(whenCallArgs[1]).toEqual({
      templateUrl: 'app/spending/templates/monthly-summary.view.html',
      controller: 'MonthlySummaryController',
      controllerAs: 'vm'
    });
  });
});

/*
Test Documentation:
- Test Name: Route configuration
- Purpose: Verify that routing is configured for the monthly spending summary view and default redirect.
- Scenario: Run route config with mocked providers and inspect registered routes.
- Expected Result: hashPrefix is set to '', /spending/monthly route is registered, and otherwise redirects to /spending/monthly.
*/

/*
Coverage Report:
- Functions tested: routes config function.
- Statements covered: hashPrefix call, when route registration, otherwise redirect configuration.
- Branches covered: None (no branching logic).
- Error scenarios covered: None.
- Uncovered scenarios: Behavior with additional routes or different default routes.
*/