/*
Test Documentation:
- Test Name: notificationService - success
- Purpose: Validates success notification
- Scenario: Show success notification
- Expected Result: Should call toastr.success and broadcast event

Test Documentation:
- Test Name: notificationService - error
- Purpose: Validates error notification
- Scenario: Show error notification
- Expected Result: Should call toastr.error and broadcast event

Test Documentation:
- Test Name: notificationService - warning
- Purpose: Validates warning notification
- Scenario: Show warning notification
- Expected Result: Should call toastr.warning and broadcast event

Test Documentation:
- Test Name: notificationService - info
- Purpose: Validates info notification
- Scenario: Show info notification
- Expected Result: Should call toastr.info and broadcast event

Coverage Report:
- Functions tested: success, error, warning, info
- Scenarios covered: all notification types, event broadcasting
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('notificationService', function() {
    var notificationService, $rootScope;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(function() {
      window.toastr = {
        success: jasmine.createSpy('success'),
        error: jasmine.createSpy('error'),
        warning: jasmine.createSpy('warning'),
        info: jasmine.createSpy('info')
      };
    });

    beforeEach(inject(function(_notificationService_, _$rootScope_) {
      notificationService = _notificationService_;
      $rootScope = _$rootScope_;
      spyOn($rootScope, '$broadcast');
    }));

    describe('success', function() {
      it('should show success notification with default title', function() {
        var message = 'Operation successful';
        notificationService.success(message);
        expect(window.toastr.success).toHaveBeenCalledWith(message, 'Success');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notification:success', {message: message, title: undefined});
      });

      it('should show success notification with custom title', function() {
        var message = 'Data saved';
        var title = 'Great!';
        notificationService.success(message, title);
        expect(window.toastr.success).toHaveBeenCalledWith(message, title);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notification:success', {message: message, title: title});
      });
    });

    describe('error', function() {
      it('should show error notification with default title', function() {
        var message = 'Operation failed';
        notificationService.error(message);
        expect(window.toastr.error).toHaveBeenCalledWith(message, 'Error');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notification:error', {message: message, title: undefined});
      });

      it('should show error notification with custom title', function() {
        var message = 'Connection lost';
        var title = 'Network Error';
        notificationService.error(message, title);
        expect(window.toastr.error).toHaveBeenCalledWith(message, title);
      });
    });

    describe('warning', function() {
      it('should show warning notification with default title', function() {
        var message = 'Data is stale';
        notificationService.warning(message);
        expect(window.toastr.warning).toHaveBeenCalledWith(message, 'Warning');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notification:warning', {message: message, title: undefined});
      });

      it('should show warning notification with custom title', function() {
        var message = 'Budget threshold reached';
        var title = 'Alert';
        notificationService.warning(message, title);
        expect(window.toastr.warning).toHaveBeenCalledWith(message, title);
      });
    });

    describe('info', function() {
      it('should show info notification with default title', function() {
        var message = 'New update available';
        notificationService.info(message);
        expect(window.toastr.info).toHaveBeenCalledWith(message, 'Info');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notification:info', {message: message, title: undefined});
      });

      it('should show info notification with custom title', function() {
        var message = 'Sync completed';
        var title = 'Information';
        notificationService.info(message, title);
        expect(window.toastr.info).toHaveBeenCalledWith(message, title);
      });
    });
  });
})();