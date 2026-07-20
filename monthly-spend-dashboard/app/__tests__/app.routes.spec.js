describe('configureRoutes (app.routes)', function () {
  var $routeProviderMock;
  var $locationProviderMock;

  beforeEach(function () {
    $routeProviderMock = {
      when: jasmine.createSpy('when').and.callFake(function () { return $routeProviderMock; }),
      otherwise: jasmine.createSpy('otherwise')
    };
    $locationProviderMock = {
      html5Mode: jasmine.createSpy('html5Mode')
    };
  });

  function configureRoutes($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
      .when('/dashboard', {
        templateUrl: 'features/dashboard/templates/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/dashboard/:month', {
        templateUrl: 'features/dashboard/templates/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }

  it('should disable html5Mode', function () {
    // Arrange
    var $routeProvider = $routeProviderMock;
    var $locationProvider = $locationProviderMock;

    // Act
    configureRoutes($routeProvider, $locationProvider);

    // Assert
    expect($locationProvider.html5Mode).toHaveBeenCalledWith(false);
  });

  it('should define /dashboard and /dashboard/:month routes', function () {
    // Arrange
    var $routeProvider = $routeProviderMock;
    var $locationProvider = $locationProviderMock;

    // Act
    configureRoutes($routeProvider, $locationProvider);

    // Assert
    expect($routeProvider.when.calls.count()).toBe(2);
    expect($routeProvider.when.calls.argsFor(0)[0]).toBe('/dashboard');
    expect($routeProvider.when.calls.argsFor(1)[0]).toBe('/dashboard/:month');
  });

  it('should configure otherwise route to redirect to /dashboard', function () {
    // Arrange
    var $routeProvider = $routeProviderMock;
    var $locationProvider = $locationProviderMock;

    // Act
    configureRoutes($routeProvider, $locationProvider);

    // Assert
    expect($routeProvider.otherwise).toHaveBeenCalledWith({ redirectTo: '/dashboard' });
  });
});

/*
Test Documentation:
- Test Name: configureRoutes routing behavior
- Purpose: Ensure that HTML5 mode and routes are configured as expected.
- Scenario: Invoke configureRoutes with mocked $routeProvider and $locationProvider.
- Expected Result: html5Mode is disabled; two routes and a default redirect are registered.
*/

/*
Coverage Report:
- Functions tested: configureRoutes
- Statements covered: html5Mode call, when() calls for /dashboard and /dashboard/:month, otherwise() call.
- Branches covered: N/A (no conditional logic).
- Error scenarios covered: None explicitly; misconfiguration will fail expectations.
- Uncovered scenarios: Runtime AngularJS routing behavior (handled by framework and not unit-tested here).
*/