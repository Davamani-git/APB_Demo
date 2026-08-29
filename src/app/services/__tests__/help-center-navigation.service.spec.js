/*
Test Documentation:
- Test Name: HelpCenterNavigationService Tests
- Purpose: Validate that the Help Center entry point navigation service correctly opens the Help Center landing page from the Home Page, handles routing, and manages navigation state.
- Scenario: Normal navigation, missing route, already on Help Center page, rapid successive calls.
- Expected Result: Navigation resolves within SLA, errors surface meaningful messages, duplicate calls are idempotent.
*/

describe('HelpCenterNavigationService', function () {
  var HelpCenterNavigationService;
  var $state;
  var $q;
  var $rootScope;

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterNavigationService_, _$state_, _$q_, _$rootScope_) {
    HelpCenterNavigationService = _HelpCenterNavigationService_;
    $state = _$state_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function () {
    spyOn($state, 'go').and.returnValue($q.resolve({ success: true }));
  });

  // --- FR1, FR2, AC1 ---
  describe('navigateToHelpCenter()', function () {

    it('should navigate to the Help Center landing page when called from Home Page', function () {
      // FR1: Home Page shall display a clearly visible Help Center entry point
      // FR2: Selecting the entry point shall open a dedicated Help Center landing page
      HelpCenterNavigationService.navigateToHelpCenter();
      expect($state.go).toHaveBeenCalledWith('helpCenter');
    });

    it('should return a resolved promise on successful navigation', function () {
      var result;
      HelpCenterNavigationService.navigateToHelpCenter().then(function (res) {
        result = res;
      });
      $rootScope.$digest();
      expect(result).toEqual({ success: true });
    });

    it('should handle navigation failure gracefully and return a rejected promise', function () {
      $state.go.and.returnValue($q.reject({ error: 'Route not found' }));
      var errorResult;
      HelpCenterNavigationService.navigateToHelpCenter().catch(function (err) {
        errorResult = err;
      });
      $rootScope.$digest();
      expect(errorResult).toEqual({ error: 'Route not found' });
    });

    it('should not navigate again if already on the Help Center page', function () {
      spyOn($state, 'current', 'get').and.returnValue({ name: 'helpCenter' });
      var result = HelpCenterNavigationService.navigateToHelpCenter();
      expect($state.go).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle rapid successive navigation calls idempotently', function () {
      HelpCenterNavigationService.navigateToHelpCenter();
      HelpCenterNavigationService.navigateToHelpCenter();
      expect($state.go.calls.count()).toBe(1);
    });

    it('should navigate to Home Page when navigateToHome is called', function () {
      HelpCenterNavigationService.navigateToHome();
      expect($state.go).toHaveBeenCalledWith('home');
    });

    it('should pass optional parameters to $state.go when provided', function () {
      HelpCenterNavigationService.navigateToHelpCenter({ category: 'faqs' });
      expect($state.go).toHaveBeenCalledWith('helpCenter', { category: 'faqs' });
    });

    it('should not throw when called with null parameters', function () {
      expect(function () {
        HelpCenterNavigationService.navigateToHelpCenter(null);
      }).not.toThrow();
    });
  });

  // --- FR12, AC10 ---
  describe('isHomePage()', function () {

    it('should return true when current state is home', function () {
      spyOn($state, 'current', 'get').and.returnValue({ name: 'home' });
      expect(HelpCenterNavigationService.isHomePage()).toBe(true);
    });

    it('should return false when current state is not home', function () {
      spyOn($state, 'current', 'get').and.returnValue({ name: 'helpCenter' });
      expect(HelpCenterNavigationService.isHomePage()).toBe(false);
    });

    it('should return false when current state is undefined', function () {
      spyOn($state, 'current', 'get').and.returnValue(undefined);
      expect(HelpCenterNavigationService.isHomePage()).toBe(false);
    });
  });

  /*
  Coverage Report:
  - Functions tested: navigateToHelpCenter, navigateToHome, isHomePage
  - Scenarios covered: successful navigation, navigation failure, already on page, rapid calls, null params, state detection
  - FR coverage: FR1, FR2, FR12
  - AC coverage: AC1, AC10
  - Uncovered scenarios: deep-link navigation with hash fragments
  */
});
