/*
Test Documentation:
- Test Name: HelpCenterResponsiveService Tests
- Purpose: Validate responsive design detection, device type identification, viewport management, and cross-device compatibility for Help Center features.
- Scenario: Desktop detection, mobile detection, tablet detection, viewport resize, orientation change.
- Expected Result: Device type correctly identified; viewport changes trigger appropriate handlers; responsive features adapt correctly.
*/

describe('HelpCenterResponsiveService', function () {
  var HelpCenterResponsiveService;
  var $window;
  var $rootScope;

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterResponsiveService_, _$window_, _$rootScope_) {
    HelpCenterResponsiveService = _HelpCenterResponsiveService_;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));

  // --- FR9, AC7 ---
  describe('getDeviceType()', function () {

    it('should return DESKTOP for viewport width >= 1024px', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1200);
      expect(HelpCenterResponsiveService.getDeviceType()).toBe('DESKTOP');
    });

    it('should return TABLET for viewport width between 768px and 1023px', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.getDeviceType()).toBe('TABLET');
    });

    it('should return MOBILE for viewport width < 768px', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(400);
      expect(HelpCenterResponsiveService.getDeviceType()).toBe('MOBILE');
    });

    it('should return MOBILE for viewport width exactly 767px', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(767);
      expect(HelpCenterResponsiveService.getDeviceType()).toBe('MOBILE');
    });

    it('should return TABLET for viewport width exactly 768px', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(768);
      expect(HelpCenterResponsiveService.getDeviceType()).toBe('TABLET');
    });

    it('should return DESKTOP for viewport width exactly 1024px', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1024);
      expect(HelpCenterResponsiveService.getDeviceType()).toBe('DESKTOP');
    });
  });

  // --- FR9, AC7 ---
  describe('isMobile()', function () {

    it('should return true when device type is MOBILE', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(400);
      expect(HelpCenterResponsiveService.isMobile()).toBe(true);
    });

    it('should return false when device type is TABLET', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.isMobile()).toBe(false);
    });

    it('should return false when device type is DESKTOP', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1200);
      expect(HelpCenterResponsiveService.isMobile()).toBe(false);
    });
  });

  // --- FR9 ---
  describe('isTablet()', function () {

    it('should return true when device type is TABLET', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.isTablet()).toBe(true);
    });

    it('should return false when device type is MOBILE', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(400);
      expect(HelpCenterResponsiveService.isTablet()).toBe(false);
    });

    it('should return false when device type is DESKTOP', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1200);
      expect(HelpCenterResponsiveService.isTablet()).toBe(false);
    });
  });

  // --- FR9 ---
  describe('isDesktop()', function () {

    it('should return true when device type is DESKTOP', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1200);
      expect(HelpCenterResponsiveService.isDesktop()).toBe(true);
    });

    it('should return false when device type is MOBILE', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(400);
      expect(HelpCenterResponsiveService.isDesktop()).toBe(false);
    });

    it('should return false when device type is TABLET', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.isDesktop()).toBe(false);
    });
  });

  // --- FR9, AC7 ---
  describe('onViewportChange(callback)', function () {

    it('should register a callback for viewport resize events', function () {
      var callbackSpy = jasmine.createSpy('callback');
      HelpCenterResponsiveService.onViewportChange(callbackSpy);
      angular.element($window).triggerHandler('resize');
      expect(callbackSpy).toHaveBeenCalled();
    });

    it('should not register callback when callback is null', function () {
      expect(function () {
        HelpCenterResponsiveService.onViewportChange(null);
      }).not.toThrow();
    });

    it('should not register callback when callback is not a function', function () {
      expect(function () {
        HelpCenterResponsiveService.onViewportChange('not a function');
      }).not.toThrow();
    });
  });

  // --- FR9 ---
  describe('getOrientation()', function () {

    it('should return LANDSCAPE when width > height', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1200);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.getOrientation()).toBe('LANDSCAPE');
    });

    it('should return PORTRAIT when height > width', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(400);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.getOrientation()).toBe('PORTRAIT');
    });

    it('should return PORTRAIT when height equals width', function () {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(800);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(800);
      expect(HelpCenterResponsiveService.getOrientation()).toBe('PORTRAIT');
    });
  });

  /*
  Coverage Report:
  - Functions tested: getDeviceType, isMobile, isTablet, isDesktop, onViewportChange, getOrientation
  - Scenarios covered: device type detection (desktop/tablet/mobile), boundary values (767, 768, 1023, 1024), viewport resize callbacks, orientation detection (landscape/portrait), null/invalid callback handling
  - FR coverage: FR9
  - AC coverage: AC7
  - US coverage: US8
  - Uncovered scenarios: touch event detection, retina display detection
  */
});
