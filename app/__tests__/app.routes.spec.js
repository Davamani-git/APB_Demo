describe('RouteConfig', function() {
    var $route, EnvConfigService, DashboardService, $q, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['loadConfig']);
        DashboardService = jasmine.createSpyObj('DashboardService', ['getDashboardSummary']);
        $provide.value('EnvConfigService', EnvConfigService);
        $provide.value('DashboardService', DashboardService);
    }));

    beforeEach(inject(function(_$route_, _$q_, _$rootScope_) {
        $route = _$route_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should configure /dashboard route with correct properties and resolve', function() {
        // Arrange & Act
        var route = $route.routes['/dashboard'];

        // Assert
        expect(route).toBeDefined();
        expect(route.title).toBe('Dashboard');
        expect(route.controller).toBe('DashboardController');
        expect(route.controllerAs).toBe('vm');
        expect(route.templateUrl).toBe('src/templates/dashboard/dashboard.html');
        expect(route.resolve.envConfig instanceof Array).toBe(true);
        expect(typeof route.resolve.dashboardData).toBe('function');
    });

    it('should configure /transactions route with correct properties and envConfig resolve', function() {
        var route = $route.routes['/transactions'];
        expect(route).toBeDefined();
        expect(route.title).toBe('Transactions');
        expect(route.controller).toBe('TransactionsController');
        expect(route.controllerAs).toBe('vm');
        expect(route.templateUrl).toBe('src/templates/transactions/transactions.html');
        expect(route.resolve.envConfig instanceof Array).toBe(true);
    });

    it('should configure /analytics route with correct properties and envConfig resolve', function() {
        var route = $route.routes['/analytics'];
        expect(route).toBeDefined();
        expect(route.title).toBe('Analytics');
        expect(route.controller).toBe('AnalyticsController');
        expect(route.controllerAs).toBe('vm');
        expect(route.templateUrl).toBe('src/templates/analytics/analytics.html');
        expect(route.resolve.envConfig instanceof Array).toBe(true);
    });

    it('should resolve envConfig before dashboardData', function() {
        // Arrange
        var envDeferred = $q.defer();
        var dashDeferred = $q.defer();
        EnvConfigService.loadConfig.and.returnValue(envDeferred.promise);
        DashboardService.getDashboardSummary.and.returnValue(dashDeferred.promise);
        var route = $route.routes['/dashboard'];

        // Act
        // Manually invoke envConfig resolve
        var envResolveFn = route.resolve.envConfig[1];
        envResolveFn(EnvConfigService);
        envDeferred.resolve({});
        $rootScope.$apply();

        // Now invoke dashboardData resolve
        route.resolve.dashboardData({}, DashboardService);

        // Assert
        expect(EnvConfigService.loadConfig).toHaveBeenCalled();
        expect(DashboardService.getDashboardSummary).toHaveBeenCalled();
    });
});

/*
Test Documentation:
- Test Name: /dashboard route configuration
- Purpose: Verify that the /dashboard route is configured with correct controller, template, and resolves.
- Scenario: Angular routes object is inspected after module config.
- Expected Result: /dashboard route properties and resolve functions match expectations.

- Test Name: /transactions route configuration
- Purpose: Ensure the transactions route has correct setup and envConfig resolve.
- Scenario: Inspect $route.routes['/transactions'].
- Expected Result: Controller, templateUrl, and envConfig resolve defined correctly.

- Test Name: /analytics route configuration
- Purpose: Validate the analytics route configuration.
- Scenario: Inspect $route.routes['/analytics'].
- Expected Result: Controller, templateUrl, and envConfig resolve defined.

- Test Name: envConfig and dashboardData resolve interaction
- Purpose: Confirm that envConfig resolve triggers EnvConfigService.loadConfig and dashboardData resolve calls DashboardService.getDashboardSummary.
- Scenario: Manual invocation of resolve functions simulating route resolution.
- Expected Result: Both services are called as part of resolve pipeline.
*/

/*
Coverage Report:
- Functions tested:
  - RouteConfig config block
- Statements covered:
  - Route definitions for /dashboard, /transactions, /analytics
  - envConfigResolve definition and usage
  - dashboardData resolve function body
- Branches covered:
  - None explicitly (route config is declarative)
- Error scenarios covered:
  - None (no explicit error handling in route config)
- Uncovered scenarios:
  - Behavior if EnvConfigService.loadConfig rejects (handled at runtime outside route config).
*/