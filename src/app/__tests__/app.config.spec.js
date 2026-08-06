(function() {
  'use strict';

  describe('App Configuration', function() {
    var $route, $location, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_) {
      $route = _$route_;
      $location = _$location_;
      $rootScope = _$rootScope_;
    }));

    /*
    Test Documentation:
    - Test Name: should configure /dashboard route
    - Purpose: Verify dashboard route configuration
    - Scenario: Route configuration is loaded
    - Expected Result: Dashboard route has correct template and controller
    */
    it('should configure /dashboard route', function() {
      expect($route.routes['/dashboard']).toBeDefined();
      expect($route.routes['/dashboard'].templateUrl).toBe('src/app/dashboard/dashboard.html');
      expect($route.routes['/dashboard'].controller).toBe('DashboardController');
      expect($route.routes['/dashboard'].controllerAs).toBe('vm');
    });

    /*
    Test Documentation:
    - Test Name: should configure /analytics route
    - Purpose: Verify analytics route configuration
    - Scenario: Route configuration is loaded
    - Expected Result: Analytics route has correct template and controller
    */
    it('should configure /analytics route', function() {
      expect($route.routes['/analytics']).toBeDefined();
      expect($route.routes['/analytics'].templateUrl).toBe('src/app/analytics/analytics.html');
      expect($route.routes['/analytics'].controller).toBe('AnalyticsController');
      expect($route.routes['/analytics'].controllerAs).toBe('vm');
    });

    /*
    Test Documentation:
    - Test Name: should configure /cards route
    - Purpose: Verify card management route configuration
    - Scenario: Route configuration is loaded
    - Expected Result: Cards route has correct template and controller
    */
    it('should configure /cards route', function() {
      expect($route.routes['/cards']).toBeDefined();
      expect($route.routes['/cards'].templateUrl).toBe('src/app/card-management/card-management.html');
      expect($route.routes['/cards'].controller).toBe('CardManagementController');
      expect($route.routes['/cards'].controllerAs).toBe('vm');
    });

    /*
    Test Documentation:
    - Test Name: should redirect to /dashboard for unknown routes
    - Purpose: Verify default route redirection
    - Scenario: User navigates to undefined route
    - Expected Result: Route redirects to /dashboard
    */
    it('should redirect to /dashboard for unknown routes', function() {
      expect($route.routes[null].redirectTo).toBe('/dashboard');
    });

    /*
    Coverage Report:
    - Functions tested: Route configuration
    - Statements/branches covered: All route definitions, otherwise clause
    - Error scenarios covered: Unknown route handling
    - Uncovered scenarios: None - all routes and fallback tested
    */
  });
})();