/*
Test Documentation:
- Test Name: HelpCenterErrorService Tests
- Purpose: Validate error message generation, error state management, actionable next steps provision, and error logging for unavailable resources.
- Scenario: Resource unavailable, network error, validation error, generic error, error clearing.
- Expected Result: Meaningful error messages generated; actionable next steps provided; error state managed correctly.
*/

describe('HelpCenterErrorService', function () {
  var HelpCenterErrorService;
  var $rootScope;

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterErrorService_, _$rootScope_) {
    HelpCenterErrorService = _HelpCenterErrorService_;
    $rootScope = _$rootScope_;
  }));

  // --- FR11, AC8 ---
  describe('setError(errorType, context)', function () {

    it('should set error message for RESOURCE_UNAVAILABLE type', function () {
      HelpCenterErrorService.setError('RESOURCE_UNAVAILABLE', { resource: 'video' });
      var error = HelpCenterErrorService.getError();
      expect(error.message).toContain('unavailable');
      expect(error.type).toBe('RESOURCE_UNAVAILABLE');
    });

    it('should set error message for NETWORK_ERROR type', function () {
      HelpCenterErrorService.setError('NETWORK_ERROR');
      var error = HelpCenterErrorService.getError();
      expect(error.message).toContain('network');
      expect(error.type).toBe('NETWORK_ERROR');
    });

    it('should set error message for VALIDATION_ERROR type', function () {
      HelpCenterErrorService.setError('VALIDATION_ERROR', { field: 'keyword' });
      var error = HelpCenterErrorService.getError();
      expect(error.message).toContain('Invalid');
      expect(error.type).toBe('VALIDATION_ERROR');
    });

    it('should set generic error message for unknown error type', function () {
      HelpCenterErrorService.setError('UNKNOWN_ERROR');
      var error = HelpCenterErrorService.getError();
      expect(error.message).toContain('error occurred');
      expect(error.type).toBe('UNKNOWN_ERROR');
    });

    it('should include context in error object when provided', function () {
      HelpCenterErrorService.setError('RESOURCE_UNAVAILABLE', { resource: 'article', id: 'a001' });
      var error = HelpCenterErrorService.getError();
      expect(error.context.resource).toBe('article');
      expect(error.context.id).toBe('a001');
    });

    it('should not throw when context is null', function () {
      expect(function () {
        HelpCenterErrorService.setError('NETWORK_ERROR', null);
      }).not.toThrow();
    });

    it('should broadcast error event on $rootScope', function () {
      spyOn($rootScope, '$broadcast');
      HelpCenterErrorService.setError('NETWORK_ERROR');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('helpCenter:error', jasmine.any(Object));
    });
  });

  // --- FR11, AC8 ---
  describe('getError()', function () {

    it('should return null when no error is set', function () {
      expect(HelpCenterErrorService.getError()).toBeNull();
    });

    it('should return the current error object when error is set', function () {
      HelpCenterErrorService.setError('NETWORK_ERROR');
      var error = HelpCenterErrorService.getError();
      expect(error).not.toBeNull();
      expect(error.type).toBe('NETWORK_ERROR');
    });
  });

  // --- FR11, AC8 ---
  describe('clearError()', function () {

    it('should clear the current error', function () {
      HelpCenterErrorService.setError('NETWORK_ERROR');
      HelpCenterErrorService.clearError();
      expect(HelpCenterErrorService.getError()).toBeNull();
    });

    it('should not throw when clearing error when none is set', function () {
      expect(function () {
        HelpCenterErrorService.clearError();
      }).not.toThrow();
    });

    it('should broadcast error cleared event on $rootScope', function () {
      spyOn($rootScope, '$broadcast');
      HelpCenterErrorService.setError('NETWORK_ERROR');
      HelpCenterErrorService.clearError();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('helpCenter:errorCleared');
    });
  });

  // --- FR11, AC8 ---
  describe('getActionableSteps(errorType)', function () {

    it('should return actionable steps for RESOURCE_UNAVAILABLE', function () {
      var steps = HelpCenterErrorService.getActionableSteps('RESOURCE_UNAVAILABLE');
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toContain('try again');
    });

    it('should return actionable steps for NETWORK_ERROR', function () {
      var steps = HelpCenterErrorService.getActionableSteps('NETWORK_ERROR');
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toContain('connection');
    });

    it('should return actionable steps for VALIDATION_ERROR', function () {
      var steps = HelpCenterErrorService.getActionableSteps('VALIDATION_ERROR');
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toContain('input');
    });

    it('should return generic steps for unknown error type', function () {
      var steps = HelpCenterErrorService.getActionableSteps('UNKNOWN_ERROR');
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toContain('contact support');
    });

    it('should return empty array when errorType is null', function () {
      var steps = HelpCenterErrorService.getActionableSteps(null);
      expect(steps).toEqual([]);
    });

    it('should return empty array when errorType is undefined', function () {
      var steps = HelpCenterErrorService.getActionableSteps(undefined);
      expect(steps).toEqual([]);
    });
  });

  // --- FR11 ---
  describe('hasError()', function () {

    it('should return false when no error is set', function () {
      expect(HelpCenterErrorService.hasError()).toBe(false);
    });

    it('should return true when an error is set', function () {
      HelpCenterErrorService.setError('NETWORK_ERROR');
      expect(HelpCenterErrorService.hasError()).toBe(true);
    });

    it('should return false after error is cleared', function () {
      HelpCenterErrorService.setError('NETWORK_ERROR');
      HelpCenterErrorService.clearError();
      expect(HelpCenterErrorService.hasError()).toBe(false);
    });
  });

  /*
  Coverage Report:
  - Functions tested: setError, getError, clearError, getActionableSteps, hasError
  - Scenarios covered: error types (RESOURCE_UNAVAILABLE, NETWORK_ERROR, VALIDATION_ERROR, UNKNOWN_ERROR), context inclusion, null/undefined inputs, error state management, event broadcasting, actionable steps generation
  - FR coverage: FR11
  - AC coverage: AC8
  - US coverage: US6, US9
  - Uncovered scenarios: error logging to external service, error rate limiting
  */
});
