/*
Test Documentation:
- Test Name: ToastService Unit Tests
- Purpose: Validate toast notification display logic including message formatting, type classification, and helper methods.
- Scenario: show() with different types, error() method, success() method, info() method, message and type validation.
- Expected Result: Each method correctly sets message and type properties; helper methods delegate to show() with correct type.
*/

describe('ToastService', function () {
  'use strict';

  var ToastService;

  beforeEach(module('fraudAlertApp'));

  beforeEach(inject(function (_ToastService_) {
    ToastService = _ToastService_;
  }));

  beforeEach(function () {
    // Reset toast state before each test
    ToastService.message = '';
    ToastService.type = '';
  });

  // ─── show ───────────────────────────────────────────────────────────────────

  describe('show()', function () {

    it('should set message and type properties when called', function () {
      ToastService.show('Test message', 'info');
      expect(ToastService.message).toBe('Test message');
      expect(ToastService.type).toBe('info');
    });

    it('should handle error type', function () {
      ToastService.show('Error occurred', 'error');
      expect(ToastService.message).toBe('Error occurred');
      expect(ToastService.type).toBe('error');
    });

    it('should handle success type', function () {
      ToastService.show('Operation successful', 'success');
      expect(ToastService.message).toBe('Operation successful');
      expect(ToastService.type).toBe('success');
    });

    it('should handle info type', function () {
      ToastService.show('Information message', 'info');
      expect(ToastService.message).toBe('Information message');
      expect(ToastService.type).toBe('info');
    });

    it('should overwrite previous message and type', function () {
      ToastService.show('First message', 'info');
      ToastService.show('Second message', 'error');
      expect(ToastService.message).toBe('Second message');
      expect(ToastService.type).toBe('error');
    });

    it('should handle empty message string', function () {
      ToastService.show('', 'info');
      expect(ToastService.message).toBe('');
      expect(ToastService.type).toBe('info');
    });

    it('should handle undefined type', function () {
      ToastService.show('Message without type');
      expect(ToastService.message).toBe('Message without type');
      expect(ToastService.type).toBeUndefined();
    });
  });

  // ─── error ──────────────────────────────────────────────────────────────────

  describe('error()', function () {

    it('should call show() with type error', function () {
      spyOn(ToastService, 'show');
      ToastService.error('Error message');
      expect(ToastService.show).toHaveBeenCalledWith('Error message', 'error');
    });

    it('should set message and type to error', function () {
      ToastService.error('Critical error');
      expect(ToastService.message).toBe('Critical error');
      expect(ToastService.type).toBe('error');
    });

    it('should handle empty error message', function () {
      ToastService.error('');
      expect(ToastService.message).toBe('');
      expect(ToastService.type).toBe('error');
    });
  });

  // ─── success ────────────────────────────────────────────────────────────────

  describe('success()', function () {

    it('should call show() with type success', function () {
      spyOn(ToastService, 'show');
      ToastService.success('Success message');
      expect(ToastService.show).toHaveBeenCalledWith('Success message', 'success');
    });

    it('should set message and type to success', function () {
      ToastService.success('Operation completed');
      expect(ToastService.message).toBe('Operation completed');
      expect(ToastService.type).toBe('success');
    });

    it('should handle empty success message', function () {
      ToastService.success('');
      expect(ToastService.message).toBe('');
      expect(ToastService.type).toBe('success');
    });
  });

  // ─── info ───────────────────────────────────────────────────────────────────

  describe('info()', function () {

    it('should call show() with type info', function () {
      spyOn(ToastService, 'show');
      ToastService.info('Info message');
      expect(ToastService.show).toHaveBeenCalledWith('Info message', 'info');
    });

    it('should set message and type to info', function () {
      ToastService.info('Informational notice');
      expect(ToastService.message).toBe('Informational notice');
      expect(ToastService.type).toBe('info');
    });

    it('should handle empty info message', function () {
      ToastService.info('');
      expect(ToastService.message).toBe('');
      expect(ToastService.type).toBe('info');
    });
  });

  // ─── Integration scenarios ──────────────────────────────────────────────────

  describe('Integration scenarios', function () {

    it('should handle rapid successive calls', function () {
      ToastService.info('First');
      ToastService.error('Second');
      ToastService.success('Third');
      expect(ToastService.message).toBe('Third');
      expect(ToastService.type).toBe('success');
    });

    it('should handle all PRD-defined toast types', function () {
      var types = ['error', 'success', 'info'];
      types.forEach(function (type) {
        ToastService.show('Test ' + type, type);
        expect(ToastService.type).toBe(type);
      });
    });

    it('should maintain state between calls', function () {
      ToastService.error('Error 1');
      expect(ToastService.message).toBe('Error 1');
      expect(ToastService.type).toBe('error');

      // State should persist until next call
      expect(ToastService.message).toBe('Error 1');

      ToastService.success('Success 1');
      expect(ToastService.message).toBe('Success 1');
      expect(ToastService.type).toBe('success');
    });
  });

  /*
  Coverage Report:
  - Functions tested: show, error, success, info
  - Scenarios covered:
      show    -> all types (error, success, info), empty message, undefined type, overwrite behavior
      error   -> delegates to show with error type, empty message
      success -> delegates to show with success type, empty message
      info    -> delegates to show with info type, empty message
      Integration -> rapid successive calls, all PRD types, state persistence
  - Uncovered scenarios: none identified for this service
  */
});
