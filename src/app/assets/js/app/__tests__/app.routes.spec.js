describe('appmrn25.dashboard routes', function() {
  var $routeProviderMock;

  beforeEach(function() {
    $routeProviderMock = jasmine.createSpyObj('$routeProvider', ['when']);
  });

  it('should configure /dashboard route with correct template and controller', function() {
    // Arrange
    var configFn;
    (function() {
      var configBlocks = angular.module('appmrn25.dashboard')._configBlocks;
      for (var i = 0; i < configBlocks.length; i++) {
        if (configBlocks[i][1] === 'config') {
          configFn = configBlocks[i][2][0];
          break;
        }
      }
    })();

    // Act
    configFn($routeProviderMock);

    // Assert
    expect($routeProviderMock.when).toHaveBeenCalled();
    var args = $routeProviderMock.when.calls.mostRecent().args;
    expect(args[0]).toBe('/dashboard');
    expect(args[1].templateUrl).toBe('src/app/assets/js/app/dashboard/templates/dashboard-overview.view.html');
    expect(args[1].controller).toBe('DashboardOverviewController');
    expect(args[1].controllerAs).toBe('vm');
  });
});

/*
Test Documentation:
- Test Name: dashboard route configuration
- Purpose: Ensure the /dashboard route is configured correctly.
- Scenario: Execute the dashboard module config function with a mocked $routeProvider.
- Expected Result: $routeProvider.when called with '/dashboard' and the expected route definition.
*/

/*
Coverage Report:
- Functions tested: config function in app.routes.js.
- Statements covered: All statements inside the config function (the when call and its literal).
- Branches covered: None.
- Error scenarios covered: None.
- Uncovered scenarios: Additional future routes (not currently defined).
*/